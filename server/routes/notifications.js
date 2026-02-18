const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// Get user notifications
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      userId,
      ...(unreadOnly === 'true' && { isRead: false })
    };

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } })
    ]);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      },
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.update({
      where: { id, userId },
      data: { isRead: true }
    });

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    res.json({
      message: 'All notifications marked as read',
      count: result.count
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.notification.delete({
      where: { id, userId }
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Get notification preferences
router.get('/preferences', async (req, res) => {
  try {
    const userId = req.user.id;

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId }
    });

    if (!preferences) {
      // Create default preferences
      preferences = await prisma.notificationPreference.create({
        data: { userId }
      });
    }

    res.json({ preferences });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// Update notification preferences
router.put('/preferences', [
  body('orderUpdates').optional().isBoolean(),
  body('deliveryUpdates').optional().isBoolean(),
  body('promotions').optional().isBoolean(),
  body('nutritionTips').optional().isBoolean(),
  body('emailFrequency').optional().isIn(['IMMEDIATE', 'DAILY', 'WEEKLY', 'NEVER']),
  body('smsEnabled').optional().isBoolean(),
  body('pushEnabled').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const updateData = req.body;

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData
      }
    });

    res.json({
      message: 'Notification preferences updated successfully',
      preferences
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

module.exports = router;