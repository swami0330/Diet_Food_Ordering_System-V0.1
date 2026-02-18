const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        age: true,
        weight: true,
        height: true,
        gender: true,
        healthConditions: true,
        dietPreferences: true,
        allergies: true,
        goalType: true,
        targetCalories: true,
        targetProtein: true,
        targetCarbs: true,
        targetFats: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('age').optional().isInt({ min: 13, max: 120 }),
  body('weight').optional().isFloat({ min: 20, max: 500 }),
  body('height').optional().isFloat({ min: 50, max: 300 }),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']),
  body('goalType').optional().isIn(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE', 'DIABETIC_CONTROL']),
  body('targetCalories').optional().isInt({ min: 800, max: 5000 }),
  body('targetProtein').optional().isInt({ min: 20, max: 300 }),
  body('targetCarbs').optional().isInt({ min: 50, max: 800 }),
  body('targetFats').optional().isInt({ min: 20, max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      phone,
      age,
      weight,
      height,
      gender,
      healthConditions,
      dietPreferences,
      allergies,
      goalType,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFats
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(age && { age }),
        ...(weight && { weight }),
        ...(height && { height }),
        ...(gender && { gender }),
        ...(healthConditions && { healthConditions }),
        ...(dietPreferences && { dietPreferences }),
        ...(allergies && { allergies }),
        ...(goalType && { goalType }),
        ...(targetCalories && { targetCalories }),
        ...(targetProtein && { targetProtein }),
        ...(targetCarbs && { targetCarbs }),
        ...(targetFats && { targetFats })
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        age: true,
        weight: true,
        height: true,
        gender: true,
        healthConditions: true,
        dietPreferences: true,
        allergies: true,
        goalType: true,
        targetCalories: true,
        targetProtein: true,
        targetCarbs: true,
        targetFats: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get order statistics
    const orderStats = await prisma.order.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { total: true }
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
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

    // Get active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        userId,
        status: 'ACTIVE'
      }
    });

    // Calculate nutrition totals from recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const nutritionData = await prisma.orderItem.aggregate({
      where: {
        order: {
          userId,
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      },
      _sum: {
        calories: true,
        protein: true,
        carbs: true,
        fats: true
      }
    });

    res.json({
      orderStats: {
        totalOrders: orderStats._count.id || 0,
        totalSpent: orderStats._sum.total || 0
      },
      recentOrders,
      activeSubscriptions,
      nutritionData: {
        totalCalories: nutritionData._sum.calories || 0,
        totalProtein: nutritionData._sum.protein || 0,
        totalCarbs: nutritionData._sum.carbs || 0,
        totalFats: nutritionData._sum.fats || 0
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    const userId = req.user.id;

    // Soft delete - deactivate account instead of hard delete
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    });

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;