const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// Get user's conversations
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        _count: {
          select: {
            messages: {
              where: { isRead: false }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Create new conversation
router.post('/conversations', [
  body('type').isIn(['SUPPORT', 'NUTRITIONIST']),
  body('message').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, message } = req.body;
    const userId = req.user.id;

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        type,
        status: 'OPEN',
        messages: {
          create: {
            userId,
            sender: 'USER',
            message
          }
        }
      },
      include: {
        messages: true
      }
    });

    res.status(201).json({
      message: 'Conversation started',
      conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
});

// Get messages for a conversation
router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Verify user owns this conversation
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { conversationId: id },
      skip,
      take: parseInt(limit),
      orderBy: { timestamp: 'desc' }
    });

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/conversations/:id/messages', [
  body('message').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // Verify conversation exists and user owns it
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        conversationId: id,
        userId,
        sender: 'USER',
        message
      }
    });

    res.status(201).json({
      message: 'Message sent',
      chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark messages as read
router.put('/messages/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.chatMessage.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

module.exports = router;