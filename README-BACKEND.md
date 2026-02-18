# NutriDash Backend API

A comprehensive Node.js backend for the NutriDash meal delivery application with authentication, order management, AI recommendations, and more.

## 🚀 Features

### Core Features
- **User Authentication** - JWT-based auth with registration, login, password reset
- **Meal Management** - CRUD operations with filtering, search, and categorization
- **Shopping Cart** - Persistent cart with coupon support
- **Order Management** - Complete order lifecycle from creation to delivery
- **Subscription Plans** - Recurring meal subscriptions with pause/resume
- **AI Recommendations** - Personalized meal suggestions using OpenAI
- **Ratings & Reviews** - User feedback system with verification
- **Real-time Chat** - Customer support and nutritionist consultations
- **Progress Tracking** - Weight tracking and nutrition analytics
- **Notifications** - Email, SMS, and push notifications
- **Admin Dashboard** - Complete admin panel with analytics

### Advanced Features
- **Payment Integration** - Stripe and Razorpay support
- **Delivery Tracking** - Real-time GPS tracking with delivery partners
- **Multi-language Support** - Internationalization ready
- **File Upload** - Cloudinary integration for images
- **Caching** - Redis for performance optimization
- **Real-time Updates** - WebSocket support for live features

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.IO
- **Payments:** Stripe, Razorpay
- **Email:** SendGrid / Nodemailer
- **SMS:** Twilio
- **File Storage:** Cloudinary
- **Caching:** Redis
- **AI:** OpenAI GPT-4

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy the `.env` file and update with your credentials:
   ```bash
   # Database
   DATABASE_URL="your-database-url"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   
   # Email (SendGrid)
   SENDGRID_API_KEY="your-sendgrid-api-key"
   FROM_EMAIL="noreply@nutridash.com"
   
   # SMS (Twilio)
   TWILIO_ACCOUNT_SID="your-twilio-account-sid"
   TWILIO_AUTH_TOKEN="your-twilio-auth-token"
   TWILIO_PHONE_NUMBER="your-twilio-phone-number"
   
   # Payment (Stripe)
   STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
   
   # Payment (Razorpay)
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
   
   # File Upload (Cloudinary)
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   
   # App Settings
   NODE_ENV="development"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   ```

3. **Database Setup**
   ```bash
   # Start Prisma dev server (for local development)
   npx prisma dev
   
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

## 🚦 Running the Server

### Development Mode
```bash
# Simple server (mock data, no database required)
npm run server

# Full server with database
npm run server:full:dev
```

### Production Mode
```bash
npm run server:full
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/admin/login` - Admin login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `DELETE /api/users/account` - Delete user account

### Meals
- `GET /api/meals` - Get meals with filtering and pagination
- `GET /api/meals/:id` - Get single meal
- `GET /api/meals/suggestions/:userId` - Get personalized suggestions
- `POST /api/meals` - Create meal (Admin)
- `PUT /api/meals/:id` - Update meal (Admin)
- `DELETE /api/meals/:id` - Delete meal (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/apply-coupon` - Apply coupon

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/track` - Track order
- `POST /api/orders/:id/rate` - Rate order

### Subscriptions
- `GET /api/subscriptions/plans` - Get subscription plans
- `GET /api/subscriptions` - Get user's subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id/pause` - Pause subscription
- `PUT /api/subscriptions/:id/resume` - Resume subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription

### Recommendations
- `GET /api/recommendations` - Get AI recommendations
- `POST /api/recommendations/refresh` - Refresh recommendations
- `POST /api/recommendations/track` - Track user interaction
- `GET /api/recommendations/trending` - Get trending meals

### Ratings
- `GET /api/ratings/meal/:mealId` - Get meal ratings
- `POST /api/ratings` - Create/update rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating
- `POST /api/ratings/:id/helpful` - Mark rating helpful
- `GET /api/ratings/my-ratings` - Get user's ratings

### Chat
- `GET /api/chat/conversations` - Get conversations
- `POST /api/chat/conversations` - Start conversation
- `GET /api/chat/conversations/:id/messages` - Get messages
- `POST /api/chat/conversations/:id/messages` - Send message

### Progress
- `POST /api/progress/weight` - Add weight entry
- `GET /api/progress/weight` - Get weight history
- `GET /api/progress/analytics` - Get nutrition analytics
- `GET /api/progress/summary` - Get progress summary

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `GET /api/notifications/preferences` - Get preferences
- `PUT /api/notifications/preferences` - Update preferences

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/analytics` - Get analytics data

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Test Credentials (Simple Server)
- **Email:** test@nutridash.com
- **Password:** password

### Admin Credentials (Full Server)
- **Email:** admin@nutridash.com
- **Password:** admin123

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts with profiles and preferences
- **Meal** - Food items with nutritional information
- **Order** - Customer orders with items and delivery details
- **Subscription** - Recurring meal plans
- **Rating** - User reviews and ratings
- **Conversation** - Chat conversations and messages
- **WeightEntry** - User weight tracking data
- **Notification** - System notifications
- **Admin** - Admin users with permissions

## 🔄 Real-time Features

The server supports real-time features using Socket.IO:

- **Chat Messages** - Live chat with support/nutritionists
- **Order Tracking** - Real-time order status updates
- **Notifications** - Instant notifications

### Socket Events
- `join-chat` - Join a chat conversation
- `send-message` - Send a chat message
- `track-order` - Track an order
- `new-message` - Receive new messages
- `order-update` - Receive order updates

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nutridash.com","password":"password"}'
```

### Test Protected Route
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer your-jwt-token"
```

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production.

### Database
1. Set up PostgreSQL database
2. Update DATABASE_URL in environment
3. Run migrations: `npm run db:push`
4. Seed data: `npm run db:seed`

### Process Management
Use PM2 or similar for production:
```bash
pm2 start server/index.js --name nutridash-api
```

## 📝 API Documentation

The API follows RESTful conventions with:
- Consistent error responses
- Pagination for list endpoints
- Input validation
- Rate limiting
- CORS support
- Security headers

### Error Response Format
```json
{
  "error": "Error message",
  "message": "Detailed description",
  "code": "ERROR_CODE"
}
```

### Success Response Format
```json
{
  "message": "Success message",
  "data": { ... },
  "pagination": { ... }
}
```

## 🔧 Development

### Code Structure
```
server/
├── index.js              # Main server file
├── index-simple.js       # Simple server for testing
├── lib/
│   └── prisma.js         # Database connection
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling
│   └── rateLimiter.js    # Rate limiting
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── users.js          # User management
│   ├── meals.js          # Meal management
│   ├── cart.js           # Shopping cart
│   ├── orders.js         # Order management
│   ├── subscriptions.js  # Subscription plans
│   ├── recommendations.js # AI recommendations
│   ├── ratings.js        # Reviews and ratings
│   ├── chat.js           # Chat system
│   ├── progress.js       # Progress tracking
│   ├── notifications.js  # Notifications
│   └── admin.js          # Admin panel
├── services/
│   ├── emailService.js   # Email sending
│   ├── smsService.js     # SMS sending
│   └── paymentService.js # Payment processing
└── scripts/
    └── seed.js           # Database seeding
```

### Adding New Features
1. Create route file in `routes/`
2. Add middleware if needed
3. Update main server file
4. Add database models to Prisma schema
5. Update API documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

---

**NutriDash Backend** - Powering healthy meal delivery with modern technology! 🥗🚀