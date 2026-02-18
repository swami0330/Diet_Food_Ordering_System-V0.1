const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { authenticateAdmin, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Admin dashboard stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      todayOrders,
      activeSubscriptions,
      pendingOrders
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'COMPLETED' }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(today.setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count({
        where: {
          status: { in: ['PREPARING', 'OUT_FOR_DELIVERY', 'IN_TRANSIT'] }
        }
      })
    ]);

    // Monthly revenue comparison
    const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: thisMonth },
          paymentStatus: 'COMPLETED'
        }
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: lastMonth, lt: thisMonth },
          paymentStatus: 'COMPLETED'
        }
      })
    ]);

    const revenueGrowth = lastMonthRevenue._sum.total 
      ? ((thisMonthRevenue._sum.total - lastMonthRevenue._sum.total) / lastMonthRevenue._sum.total) * 100
      : 0;

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        todayOrders,
        activeSubscriptions,
        pendingOrders,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all users
router.get('/users', [authenticateAdmin, checkPermission('view_users')], async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              subscriptions: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all orders
router.get('/orders', [authenticateAdmin, checkPermission('view_orders')], async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { id: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } }
        ]
      })
    };

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          },
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

// Update order status
router.put('/orders/:id/status', [
  authenticateAdmin,
  checkPermission('manage_orders'),
  body('status').isIn(['PREPARING', 'OUT_FOR_DELIVERY', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { 
        status,
        ...(status === 'DELIVERED' && { actualDelivery: new Date() })
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: req.admin.id,
        action: 'UPDATE_ORDER_STATUS',
        entityType: 'Order',
        entityId: id,
        changes: { status }
      }
    });

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get analytics data
router.get('/analytics', [authenticateAdmin, checkPermission('view_analytics')], async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Revenue analytics
    const revenueData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: daysAgo },
        paymentStatus: 'COMPLETED'
      },
      _sum: { total: true },
      _count: { id: true }
    });

    // Popular meals
    const popularMeals = await prisma.orderItem.groupBy({
      by: ['mealId'],
      where: {
        order: {
          createdAt: { gte: daysAgo }
        }
      },
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10
    });

    // Get meal details for popular meals
    const mealIds = popularMeals.map(item => item.mealId);
    const meals = await prisma.meal.findMany({
      where: { id: { in: mealIds } },
      select: { id: true, name: true, image: true, price: true }
    });

    const popularMealsWithDetails = popularMeals.map(item => ({
      ...item,
      meal: meals.find(meal => meal.id === item.mealId)
    }));

    // User growth
    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: daysAgo }
      },
      _count: { id: true }
    });

    res.json({
      period: parseInt(period),
      revenue: revenueData,
      popularMeals: popularMealsWithDetails,
      userGrowth
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;