const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { processPayment } = require('../services/paymentService');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');

const router = express.Router();

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      userId,
      ...(status && { status })
    };

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              meal: {
                select: {
                  name: true,
                  image: true,
                  dietaryTags: true
                }
              }
            }
          },
          deliveryPartner: {
            select: {
              name: true,
              phone: true,
              currentLocation: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            meal: {
              select: {
                name: true,
                image: true,
                dietaryTags: true,
                description: true
              }
            }
          }
        },
        deliveryPartner: {
          select: {
            name: true,
            phone: true,
            currentLocation: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', [
  body('deliveryAddress').isObject(),
  body('paymentMethod').isIn(['CARD', 'UPI', 'WALLET', 'COD']),
  body('couponCode').optional().trim(),
  body('scheduledFor').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { deliveryAddress, paymentMethod, couponCode, scheduledFor, paymentDetails } = req.body;

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { meal: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (item.meal.price * item.quantity), 0
    );

    let discountAmount = 0;
    let coupon = null;

    // Apply coupon if provided
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      });

      if (coupon && coupon.isActive && (!coupon.expiryDate || new Date() <= coupon.expiryDate)) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = coupon.discountValue;
        }
        discountAmount = Math.min(discountAmount, subtotal);
      }
    }

    const deliveryFee = subtotal > 500 ? 0 : 50;
    const tax = (subtotal - discountAmount) * 0.08;
    const total = subtotal - discountAmount + deliveryFee + tax;

    // Process payment for non-COD orders
    let paymentStatus = 'PENDING';
    if (paymentMethod !== 'COD') {
      try {
        const paymentResult = await processPayment({
          amount: total,
          method: paymentMethod,
          details: paymentDetails
        });
        paymentStatus = paymentResult.success ? 'COMPLETED' : 'FAILED';
        
        if (!paymentResult.success) {
          return res.status(400).json({ error: 'Payment failed', details: paymentResult.error });
        }
      } catch (paymentError) {
        console.error('Payment processing error:', paymentError);
        return res.status(400).json({ error: 'Payment processing failed' });
      }
    } else {
      paymentStatus = 'PENDING'; // COD will be completed on delivery
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        subtotal,
        tax,
        deliveryFee,
        total,
        paymentMethod,
        paymentStatus,
        deliveryAddress,
        scheduledFor,
        status: 'PREPARING',
        items: {
          create: cartItems.map(item => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: item.meal.price,
            calories: item.meal.calories,
            protein: item.meal.protein,
            carbs: item.meal.carbs,
            fats: item.meal.fats
          }))
        }
      },
      include: {
        items: {
          include: {
            meal: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    // Update coupon usage if applied
    if (coupon) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } }
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    // Send confirmation email
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, phone: true }
      });

      await sendEmail({
        to: user.email,
        subject: 'Order Confirmation - NutriDash',
        template: 'order-confirmation',
        data: {
          name: user.name,
          orderId: order.id,
          total: order.total,
          items: order.items
        }
      });

      // Send SMS for COD orders
      if (paymentMethod === 'COD' && user.phone) {
        await sendSMS({
          to: user.phone,
          message: `Order confirmed! Order ID: ${order.id}. Total: ₹${total}. We'll call before delivery.`
        });
      }
    } catch (notificationError) {
      console.error('Failed to send order confirmation:', notificationError);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: { id, userId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Cannot cancel this order' });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    // Process refund if payment was completed
    if (order.paymentStatus === 'COMPLETED') {
      // TODO: Implement refund logic
      await prisma.order.update({
        where: { id },
        data: { paymentStatus: 'REFUNDED' }
      });
    }

    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Track order
router.get('/:id/track', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        deliveryPartner: {
          select: {
            name: true,
            phone: true,
            currentLocation: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Calculate estimated delivery time based on status
    let estimatedDelivery = order.estimatedDelivery;
    if (!estimatedDelivery) {
      const now = new Date();
      switch (order.status) {
        case 'PREPARING':
          estimatedDelivery = new Date(now.getTime() + 45 * 60000); // 45 minutes
          break;
        case 'OUT_FOR_DELIVERY':
          estimatedDelivery = new Date(now.getTime() + 30 * 60000); // 30 minutes
          break;
        case 'IN_TRANSIT':
          estimatedDelivery = new Date(now.getTime() + 15 * 60000); // 15 minutes
          break;
        default:
          estimatedDelivery = order.actualDelivery;
      }
    }

    res.json({
      orderId: order.id,
      status: order.status,
      estimatedDelivery,
      actualDelivery: order.actualDelivery,
      deliveryPartner: order.deliveryPartner,
      deliveryAddress: order.deliveryAddress
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// Rate order (after delivery)
router.post('/:id/rate', [
  body('rating').isInt({ min: 1, max: 5 }),
  body('review').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: { id, userId, status: 'DELIVERED' }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found or not delivered' });
    }

    // Create rating for each meal in the order
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: id }
    });

    const ratings = await Promise.all(
      orderItems.map(item =>
        prisma.rating.upsert({
          where: {
            userId_mealId: {
              userId,
              mealId: item.mealId
            }
          },
          update: {
            rating,
            review,
            verified: true
          },
          create: {
            userId,
            mealId: item.mealId,
            rating,
            review,
            verified: true
          }
        })
      )
    );

    res.json({
      message: 'Order rated successfully',
      ratings
    });
  } catch (error) {
    console.error('Rate order error:', error);
    res.status(500).json({ error: 'Failed to rate order' });
  }
});

module.exports = router;