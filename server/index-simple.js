const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();

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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'NutriDash Backend API is running!'
  });
});

// Mock API endpoints for testing
app.get('/api/meals', (req, res) => {
  const mockMeals = [
    {
      id: 'meal-001',
      name: 'Grilled Chicken Salad',
      description: 'Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette',
      price: 180,
      calories: 320,
      protein: 35,
      carbs: 15,
      fats: 12,
      image: '/grilled-chicken-salad.png',
      dietaryTags: ['high-protein', 'low-carb', 'gluten-free'],
      goals: ['weight-loss', 'muscle-gain'],
      avgRating: 4.5,
      totalRatings: 128
    },
    {
      id: 'meal-002',
      name: 'Quinoa Power Bowl',
      description: 'Nutritious quinoa bowl with roasted vegetables, avocado, and tahini dressing',
      price: 160,
      calories: 380,
      protein: 15,
      carbs: 45,
      fats: 18,
      image: '/quinoa-power-bowl.jpg',
      dietaryTags: ['vegan', 'high-fiber', 'gluten-free'],
      goals: ['maintenance', 'weight-loss'],
      avgRating: 4.3,
      totalRatings: 95
    }
  ];

  res.json({
    meals: mockMeals,
    pagination: {
      page: 1,
      limit: 20,
      total: 2,
      pages: 1
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@nutridash.com' && password === 'password') {
    res.json({
      message: 'Login successful',
      user: {
        id: 'user-001',
        email: 'test@nutridash.com',
        name: 'Test User',
        phone: '+919876543210'
      },
      token: 'mock-jwt-token-12345'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: 'user-002',
      email,
      name,
      createdAt: new Date().toISOString()
    },
    token: 'mock-jwt-token-67890'
  });
});

// Mock protected route
app.get('/api/users/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  res.json({
    user: {
      id: 'user-001',
      email: 'test@nutridash.com',
      name: 'Test User',
      phone: '+919876543210',
      age: 28,
      weight: 70,
      height: 175,
      goalType: 'WEIGHT_LOSS',
      targetCalories: 1800,
      targetProtein: 120
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 NutriDash Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🍽️  Mock API: http://localhost:${PORT}/api/meals`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log('');
  console.log('📝 Test credentials:');
  console.log('   Email: test@nutridash.com');
  console.log('   Password: password');
});