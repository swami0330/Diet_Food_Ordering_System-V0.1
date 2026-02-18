const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });

    res.json({ plans });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
});

// Get user's subscriptions
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        plan: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Create subscription
router.post('/', [
  body('planId').isString().notEmpty(),
  body('paymentMethod').isIn(['CARD', 'UPI', 'WALLET']),
  body('startDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId, paymentMethod, startDate } = req.body;
    const userId = req.user.id;

    // Get plan details
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!plan || !plan.isActive) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    // Calculate dates
    const start = new Date(startDate);
    const renewal = new Date(start);
    renewal.setMonth(renewal.getMonth() + 1); // Monthly subscription

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        mealsPerDay: plan.mealsPerDay,
        daysPerWeek: plan.daysPerWeek,
        price: plan.price,
        startDate: start,
        renewalDate: renewal,
        paymentMethod,
        status: 'ACTIVE'
      },
      include: {
        plan: true
      }
    });

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Pause subscription
router.put('/:id/pause', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subscription = await prisma.subscription.update({
      where: { id, userId },
      data: { status: 'PAUSED' }
    });

    res.json({
      message: 'Subscription paused successfully',
      subscription
    });
  } catch (error) {
    console.error('Pause subscription error:', error);
    res.status(500).json({ error: 'Failed to pause subscription' });
  }
});

// Resume subscription
router.put('/:id/resume', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subscription = await prisma.subscription.update({
      where: { id, userId },
      data: { status: 'ACTIVE' }
    });

    res.json({
      message: 'Subscription resumed successfully',
      subscription
    });
  } catch (error) {
    console.error('Resume subscription error:', error);
    res.status(500).json({ error: 'Failed to resume subscription' });
  }
});

// Cancel subscription
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subscription = await prisma.subscription.update({
      where: { id, userId },
      data: { status: 'CANCELLED' }
    });

    res.json({
      message: 'Subscription cancelled successfully',
      subscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

module.exports = router;