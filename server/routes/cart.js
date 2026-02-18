const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// Get user's cart
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        meal: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            calories: true,
            protein: true,
            carbs: true,
            fats: true,
            image: true,
            dietaryTags: true,
            goals: true,
            availability: true,
            isActive: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter out unavailable meals
    const availableCartItems = cartItems.filter(item => 
      item.meal.availability && item.meal.isActive
    );

    // Calculate totals
    const subtotal = availableCartItems.reduce((sum, item) => 
      sum + (item.meal.price * item.quantity), 0
    );

    const totalItems = availableCartItems.reduce((sum, item) => 
      sum + item.quantity, 0
    );

    const totalCalories = availableCartItems.reduce((sum, item) => 
      sum + (item.meal.calories * item.quantity), 0
    );

    const totalProtein = availableCartItems.reduce((sum, item) => 
      sum + (item.meal.protein * item.quantity), 0
    );

    res.json({
      items: availableCartItems,
      summary: {
        subtotal,
        totalItems,
        totalCalories,
        totalProtein
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/items', [
  body('mealId').isString().notEmpty(),
  body('quantity').isInt({ min: 1, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mealId, quantity } = req.body;
    const userId = req.user.id;

    // Check if meal exists and is available
    const meal = await prisma.meal.findUnique({
      where: { id: mealId }
    });

    if (!meal || !meal.isActive || !meal.availability) {
      return res.status(404).json({ error: 'Meal not available' });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_mealId: {
          userId,
          mealId
        }
      }
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          meal: {
            select: {
              name: true,
              price: true,
              image: true
            }
          }
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          mealId,
          quantity
        },
        include: {
          meal: {
            select: {
              name: true,
              price: true,
              image: true
            }
          }
        }
      });
    }

    res.status(201).json({
      message: 'Item added to cart',
      cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/items/:id', [
  body('quantity').isInt({ min: 1, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await prisma.cartItem.update({
      where: {
        id,
        userId // Ensure user can only update their own cart items
      },
      data: { quantity },
      include: {
        meal: {
          select: {
            name: true,
            price: true,
            image: true
          }
        }
      }
    });

    res.json({
      message: 'Cart item updated',
      cartItem
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.cartItem.delete({
      where: {
        id,
        userId // Ensure user can only delete their own cart items
      }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

// Clear entire cart
router.delete('/', async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Apply coupon to cart
router.post('/apply-coupon', [
  body('couponCode').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { couponCode } = req.body;
    const userId = req.user.id;

    // Get cart total
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { meal: true }
    });

    const subtotal = cartItems.reduce((sum, item) => 
      sum + (item.meal.price * item.quantity), 0
    );

    // Find and validate coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode }
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return res.status(400).json({ 
        error: `Minimum order value of ₹${coupon.minOrderValue} required` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    res.json({
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discountAmount,
      newTotal: subtotal - discountAmount
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
});

module.exports = router;