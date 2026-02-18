const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const mealRoutes = require('./routes/meals');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const subscriptionRoutes = require('./routes/subscriptions');
const recommendationRoutes = require('./routes/recommendations');
const ratingRoutes = require('./routes/ratings');
const chatRoutes = require('./routes/chat');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/cart', authenticateToken, cartRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/subscriptions', authenticateToken, subscriptionRoutes);
app.use('/api/recommendations', authenticateToken, recommendationRoutes);
app.use('/api/ratings', authenticateToken, ratingRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/progress', authenticateToken, progressRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/billing', authenticateToken, require('./routes/billing'));
app.use('/api/admin', adminRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (conversationId) => {
    socket.join(`chat-${conversationId}`);
  });

  socket.on('send-message', async (data) => {
    // Handle real-time chat messages
    io.to(`chat-${data.conversationId}`).emit('new-message', data);
  });

  socket.on('track-order', (orderId) => {
    socket.join(`order-${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});