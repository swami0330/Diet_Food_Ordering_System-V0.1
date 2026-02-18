const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const { processPayment, createPaymentMethod, deletePaymentMethod } = require('../services/paymentService');

const router = express.Router();

// Get user's billing profiles
router.get('/profiles', auth, async (req, res) => {
  try {
    const profiles = await prisma.billingProfile.findMany({
      where: {
        userId: req.user.id,
        isActive: true
      },
      orderBy: { isDefault: 'desc' }
    });

    res.json(profiles);
  } catch (error) {
    console.error('Error fetching billing profiles:', error);
    res.status(500).json({ error: 'Failed to fetch billing profiles' });
  }
});

// Create billing profile
router.post('/profiles', [
  auth,
  body('billingName').trim().isLength({ min: 2 }),
  body('billingEmail').isEmail(),
  body('billingAddress').isObject(),
  body('companyName').optional().trim(),
  body('billingPhone').optional().trim(),
  body('taxId').optional().trim(),
  body('isDefault').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { billingName, billingEmail, billingAddress, companyName, billingPhone, taxId, isDefault } = req.body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.billingProfile.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false }
      });
    }

    const profile = await prisma.billingProfile.create({
      data: {
        userId: req.user.id,
        billingName,
        billingEmail,
        billingAddress,
        companyName,
        billingPhone,
        taxId,
        isDefault: isDefault || false
      }
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating billing profile:', error);
    res.status(500).json({ error: 'Failed to create billing profile' });
  }
});

// Update billing profile
router.put('/profiles/:id', [
  auth,
  param('id').isString(),
  body('billingName').optional().trim().isLength({ min: 2 }),
  body('billingEmail').optional().isEmail(),
  body('billingAddress').optional().isObject(),
  body('isDefault').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Verify ownership
    const profile = await prisma.billingProfile.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Billing profile not found' });
    }

    // If setting as default, unset others
    if (updateData.isDefault) {
      await prisma.billingProfile.updateMany({
        where: { userId: req.user.id, id: { not: id } },
        data: { isDefault: false }
      });
    }

    const updatedProfile = await prisma.billingProfile.update({
      where: { id },
      data: updateData
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating billing profile:', error);
    res.status(500).json({ error: 'Failed to update billing profile' });
  }
});

// Delete billing profile
router.delete('/profiles/:id', [auth, param('id').isString()], async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const profile = await prisma.billingProfile.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Billing profile not found' });
    }

    await prisma.billingProfile.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Billing profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting billing profile:', error);
    res.status(500).json({ error: 'Failed to delete billing profile' });
  }
});

// Get saved payment methods
router.get('/payment-methods', auth, async (req, res) => {
  try {
    const paymentMethods = await prisma.savedPaymentMethod.findMany({
      where: {
        userId: req.user.id,
        isActive: true
      },
      orderBy: { isDefault: 'desc' },
      select: {
        id: true,
        type: true,
        last4: true,
        brand: true,
        expiryMonth: true,
        expiryYear: true,
        holderName: true,
        isDefault: true,
        createdAt: true
      }
    });

    res.json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Add payment method
router.post('/payment-methods', [
  auth,
  body('type').isIn(['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET']),
  body('paymentDetails').isObject(),
  body('isDefault').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, paymentDetails, isDefault } = req.body;

    // Create payment method with provider (Stripe/Razorpay)
    const providerResult = await createPaymentMethod({
      userId: req.user.id,
      type,
      details: paymentDetails
    });

    if (!providerResult.success) {
      return res.status(400).json({ error: providerResult.error });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.savedPaymentMethod.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false }
      });
    }

    const savedMethod = await prisma.savedPaymentMethod.create({
      data: {
        userId: req.user.id,
        type,
        provider: providerResult.provider,
        providerMethodId: providerResult.methodId,
        last4: providerResult.last4,
        brand: providerResult.brand,
        expiryMonth: providerResult.expiryMonth,
        expiryYear: providerResult.expiryYear,
        holderName: providerResult.holderName,
        isDefault: isDefault || false
      }
    });

    res.status(201).json({
      id: savedMethod.id,
      type: savedMethod.type,
      last4: savedMethod.last4,
      brand: savedMethod.brand,
      expiryMonth: savedMethod.expiryMonth,
      expiryYear: savedMethod.expiryYear,
      holderName: savedMethod.holderName,
      isDefault: savedMethod.isDefault,
      createdAt: savedMethod.createdAt
    });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ error: 'Failed to add payment method' });
  }
});

// Delete payment method
router.delete('/payment-methods/:id', [auth, param('id').isString()], async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const paymentMethod = await prisma.savedPaymentMethod.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    // Delete from provider
    await deletePaymentMethod({
      provider: paymentMethod.provider,
      methodId: paymentMethod.providerMethodId
    });

    // Soft delete
    await prisma.savedPaymentMethod.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
});

// Get payment history
router.get('/payments', [
  auth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    const where = {
      userId: req.user.id,
      ...(status && { status })
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          order: {
            select: { id: true, createdAt: true }
          },
          subscription: {
            select: { id: true, plan: { select: { name: true } } }
          },
          invoice: {
            select: { id: true, invoiceNumber: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.payment.count({ where })
    ]);

    res.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Get payment details
router.get('/payments/:id', [auth, param('id').isString()], async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { id, userId: req.user.id },
      include: {
        order: {
          include: {
            items: {
              include: {
                meal: { select: { name: true, image: true } }
              }
            }
          }
        },
        subscription: {
          include: {
            plan: true
          }
        },
        invoice: true,
        attempts: {
          orderBy: { attemptedAt: 'desc' }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});

// Request refund
router.post('/payments/:id/refund', [
  auth,
  param('id').isString(),
  body('reason').trim().isLength({ min: 10 }),
  body('amount').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { reason, amount } = req.body;

    const payment = await prisma.payment.findFirst({
      where: { id, userId: req.user.id, status: 'COMPLETED' }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found or not eligible for refund' });
    }

    const refundAmount = amount || payment.amount;

    if (refundAmount > payment.amount) {
      return res.status(400).json({ error: 'Refund amount cannot exceed payment amount' });
    }

    // Process refund with payment provider
    const refundResult = await processPayment({
      type: 'refund',
      paymentId: payment.providerTransactionId,
      amount: refundAmount,
      reason
    });

    if (!refundResult.success) {
      return res.status(400).json({ error: refundResult.error });
    }

    // Update payment record
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: 'REFUNDED',
        refundAmount,
        refundReason: reason,
        refundedAt: new Date()
      }
    });

    res.json({
      message: 'Refund processed successfully',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

// Get invoices
router.get('/invoices', [
  auth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'])
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    const where = {
      userId: req.user.id,
      ...(status && { status })
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          billingProfile: true,
          order: {
            select: { id: true, createdAt: true }
          },
          subscription: {
            select: { id: true, plan: { select: { name: true } } }
          },
          items: true,
          payments: {
            select: { id: true, amount: true, status: true, createdAt: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.invoice.count({ where })
    ]);

    res.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get invoice details
router.get('/invoices/:id', [auth, param('id').isString()], async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: req.user.id },
      include: {
        billingProfile: true,
        order: {
          include: {
            items: {
              include: {
                meal: { select: { name: true, image: true } }
              }
            }
          }
        },
        subscription: {
          include: {
            plan: true
          }
        },
        items: true,
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    res.status(500).json({ error: 'Failed to fetch invoice details' });
  }
});

// Download invoice PDF
router.get('/invoices/:id/download', [auth, param('id').isString()], async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: req.user.id },
      include: {
        billingProfile: true,
        items: true,
        payments: true
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Generate PDF (you would implement PDF generation here)
    // For now, return invoice data
    res.json({
      message: 'PDF generation not implemented yet',
      invoice
    });
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ error: 'Failed to download invoice' });
  }
});

module.exports = router;