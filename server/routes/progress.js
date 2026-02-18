const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// Add weight entry
router.post('/weight', [
  body('weight').isFloat({ min: 20, max: 500 }),
  body('date').isISO8601(),
  body('notes').optional().trim().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { weight, date, notes } = req.body;
    const userId = req.user.id;

    const weightEntry = await prisma.weightEntry.create({
      data: {
        userId,
        weight,
        date: new Date(date),
        notes
      }
    });

    res.status(201).json({
      message: 'Weight entry added successfully',
      weightEntry
    });
  } catch (error) {
    console.error('Add weight entry error:', error);
    res.status(500).json({ error: 'Failed to add weight entry' });
  }
});

// Get weight history
router.get('/weight', async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 30 } = req.query;

    const weightEntries = await prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: parseInt(limit)
    });

    res.json({ weightEntries: weightEntries.reverse() });
  } catch (error) {
    console.error('Get weight history error:', error);
    res.status(500).json({ error: 'Failed to fetch weight history' });
  }
});

// Get nutrition analytics
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get nutrition data from orders
    const nutritionData = await prisma.orderItem.groupBy({
      by: ['order'],
      where: {
        order: {
          userId,
          createdAt: {
            gte: daysAgo
          },
          status: 'DELIVERED'
        }
      },
      _sum: {
        calories: true,
        protein: true,
        carbs: true,
        fats: true
      }
    });

    // Get daily breakdown
    const orders = await prisma.order.findMany({
      where: {
        userId,
        createdAt: {
          gte: daysAgo
        },
        status: 'DELIVERED'
      },
      include: {
        items: {
          select: {
            calories: true,
            protein: true,
            carbs: true,
            fats: true,
            quantity: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Calculate daily totals
    const dailyData = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { calories: 0, protein: 0, carbs: 0, fats: 0 };
      }

      order.items.forEach(item => {
        dailyData[date].calories += item.calories * item.quantity;
        dailyData[date].protein += item.protein * item.quantity;
        dailyData[date].carbs += item.carbs * item.quantity;
        dailyData[date].fats += item.fats * item.quantity;
      });
    });

    // Calculate averages
    const totalDays = Object.keys(dailyData).length || 1;
    const totals = Object.values(dailyData).reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fats: acc.fats + day.fats
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const averages = {
      calories: Math.round(totals.calories / totalDays),
      protein: Math.round(totals.protein / totalDays),
      carbs: Math.round(totals.carbs / totalDays),
      fats: Math.round(totals.fats / totalDays)
    };

    // Get user targets
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        targetCalories: true,
        targetProtein: true,
        targetCarbs: true,
        targetFats: true
      }
    });

    res.json({
      period: parseInt(period),
      dailyData,
      averages,
      targets: {
        calories: user.targetCalories || 2000,
        protein: user.targetProtein || 150,
        carbs: user.targetCarbs || 250,
        fats: user.targetFats || 65
      },
      totalOrders: orders.length
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get progress summary
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get latest weight entries
    const latestWeights = await prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 2
    });

    let weightChange = 0;
    if (latestWeights.length >= 2) {
      weightChange = latestWeights[0].weight - latestWeights[1].weight;
    }

    // Get this week's orders
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyOrders = await prisma.order.count({
      where: {
        userId,
        createdAt: {
          gte: weekStart
        },
        status: 'DELIVERED'
      }
    });

    // Get total orders
    const totalOrders = await prisma.order.count({
      where: { userId, status: 'DELIVERED' }
    });

    // Get active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: { userId, status: 'ACTIVE' }
    });

    res.json({
      currentWeight: latestWeights[0]?.weight || null,
      weightChange,
      weeklyOrders,
      totalOrders,
      activeSubscriptions,
      lastWeightEntry: latestWeights[0]?.date || null
    });
  } catch (error) {
    console.error('Get progress summary error:', error);
    res.status(500).json({ error: 'Failed to fetch progress summary' });
  }
});

module.exports = router;