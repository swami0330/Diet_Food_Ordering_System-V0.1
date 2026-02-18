# 🚀 NutriDash Backend Setup with XAMPP

This guide will help you set up the NutriDash backend with XAMPP's MySQL database.

## 📋 Prerequisites

1. **XAMPP** installed and running
2. **Node.js** (v18 or higher)
3. **npm** or **yarn**

## 🛠️ Quick Setup (Automated)

### Option 1: One-Command Setup (Recommended)

```bash
# Run the complete automated setup
npm run setup:xampp
```

This script will:
- ✅ Check if XAMPP is running
- ✅ Create the "nutridash" database
- ✅ Generate Prisma client
- ✅ Create all database tables
- ✅ Seed with sample data
- ✅ Test the connection

### Option 2: Manual Step-by-Step Setup

If the automated setup fails, follow these manual steps:

## 🛠️ Manual Step-by-Step Setup

### 1. Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Start **Apache** (for phpMyAdmin)
3. Start **MySQL** (for database)

![XAMPP Control Panel](https://via.placeholder.com/600x300?text=XAMPP+Control+Panel)

### 2. Create Database

#### Option A: Using phpMyAdmin (Recommended)

1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click **"New"** in the left sidebar
3. Enter database name: `nutridash`
4. Select **Collation**: `utf8mb4_unicode_ci`
5. Click **"Create"**

#### Option B: Using SQL Script

1. Go to phpMyAdmin: `http://localhost/phpmyadmin`
2. Click **"SQL"** tab
3. Copy and paste the content from `database/create-database.sql`
4. Click **"Go"**

#### Option C: Using MySQL Command Line

```bash
# Open MySQL command line (from XAMPP)
mysql -u root -p

# Create database
CREATE DATABASE nutridash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
exit;
```

### 3. Install Dependencies

```bash
# Install all required packages
npm install

# Install MySQL client for Prisma
npm install @prisma/client
```

### 4. Configure Environment

The `.env` file is already configured for XAMPP. Default settings:

```env
# Database (XAMPP MySQL)
DATABASE_URL="mysql://root:@localhost:3306/nutridash"
```

**Note:** 
- `root` = MySQL username (default in XAMPP)
- `@` = empty password (default in XAMPP)
- `localhost:3306` = MySQL server and port
- `nutridash` = database name

### 5. Generate Prisma Client

```bash
# Generate Prisma client for MySQL
npm run db:generate
```

### 6. Create Database Tables

```bash
# Push schema to MySQL database
npm run db:push
```

You should see output like:
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your schema.
```

### 7. Seed Database with Sample Data

```bash
# Add sample meals, users, and test data
npm run db:seed
```

This will create:
- 8 sample meals with nutrition data
- 3 subscription plans (Basic, Premium, Family)
- 1 admin user (admin@nutridash.com / admin123)
- 1 test user (test@nutridash.com / password)
- 1 delivery partner
- 2 sample coupons (WELCOME10, SAVE20)

### 8. Start the Backend Server

```bash
# Start the full server with database
npm run server:full:dev
```

You should see:
```
🚀 NutriDash Backend Server running on port 3001
📊 Health check: http://localhost:3001/health
```

## 🧪 Testing the Setup

### 1. Test Database Connection

```bash
# Test XAMPP MySQL connection
npm run db:test
```

### 2. Health Check

Open your browser or use curl:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-21T10:30:00.000Z",
  "message": "NutriDash Backend API is running!"
}
```

### 3. Test API Endpoints

```bash
# Test meals endpoint
curl http://localhost:3001/api/meals

# Test authentication
curl -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nutridash.com","password":"admin123"}'
```

## 📊 Verify Database in phpMyAdmin

1. Go to `http://localhost/phpmyadmin`
2. Click on `nutridash` database
3. You should see all tables created:

### Tables Created:
- `users` - User accounts and profiles
- `meals` - Food items with nutrition data
- `orders` - Customer orders
- `order_items` - Order line items
- `subscriptions` - Meal plan subscriptions
- `subscription_plans` - Available plans
- `cart_items` - Shopping cart items
- `ratings` - User reviews and ratings
- `weight_entries` - Weight tracking data
- `conversations` - Chat conversations
- `chat_messages` - Chat messages
- `notifications` - System notifications
- `notification_preferences` - User notification settings
- `recommendations` - AI recommendations
- `user_behavior` - User activity tracking
- `delivery_partners` - Delivery staff
- `coupons` - Discount codes
- `admins` - Admin users
- `admin_logs` - Admin action logs

## 🔐 Default Credentials

### Admin User
- **Email:** admin@nutridash.com
- **Password:** admin123

### Test User (for frontend testing)
- **Email:** test@nutridash.com
- **Password:** password

## 🚨 Troubleshooting

### Issue: "Can't connect to MySQL server"

**Solution:**
1. Make sure MySQL is running in XAMPP
2. Check if port 3306 is available
3. Verify database name exists
4. Run: `npm run setup:xampp` for automated fix

### Issue: "Access denied for user 'root'"

**Solution:**
1. Check if MySQL password is set in XAMPP
2. If password is set, update `.env` file:
   ```env
   DATABASE_URL="mysql://root:your_password@localhost:3306/nutridash"
   ```

### Issue: "Database 'nutridash' doesn't exist"

**Solution:**
1. Run: `npm run setup:xampp` (will create automatically)
2. Or create manually in phpMyAdmin
3. Or run the SQL script from `database/create-database.sql`

### Issue: "Prisma generate fails"

**Solution:**
```bash
# Clear Prisma cache and regenerate
npx prisma generate --force
```

### Issue: "Port 3001 already in use"

**Solution:**
1. Change port in `.env` file:
   ```env
   PORT=3002
   ```
2. Or kill the process using port 3001

### Issue: "XAMPP not starting"

**Solution:**
1. Run XAMPP as Administrator
2. Check if ports 80 (Apache) and 3306 (MySQL) are free
3. Disable Skype or other services using these ports

## 📱 Frontend Integration

Once the backend is running, update your frontend API configuration:

```typescript
// In your frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🔄 Development Workflow

### Daily Development
```bash
# 1. Start XAMPP (Apache + MySQL)
# 2. Start backend server
npm run server:full:dev

# 3. Start frontend (in another terminal)
npm run dev
```

### Database Changes
```bash
# After modifying prisma/schema.prisma
npm run db:push

# To reset database (careful - deletes all data!)
npx prisma db push --force-reset
npm run db:seed
```

### View Database
- **phpMyAdmin:** http://localhost/phpmyadmin
- **Database:** nutridash
- **Tables:** 20+ tables with all app data

## 🚀 Production Deployment

For production, consider:

1. **Secure MySQL:**
   - Set strong root password
   - Create dedicated database user
   - Enable SSL connections

2. **Environment Variables:**
   - Use production database URL
   - Set strong JWT secret
   - Configure email/SMS services

3. **Performance:**
   - Enable MySQL query cache
   - Add database indexes
   - Use connection pooling

## 📚 Additional Resources

- **Prisma Documentation:** https://www.prisma.io/docs
- **XAMPP Documentation:** https://www.apachefriends.org/docs/
- **MySQL Documentation:** https://dev.mysql.com/doc/

---

## ✅ Quick Checklist

- [ ] XAMPP installed and running
- [ ] MySQL service started in XAMPP
- [ ] Database `nutridash` created
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma client generated (`npm run db:generate`)
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Sample data seeded (`npm run db:seed`)
- [ ] Backend server running (`npm run server:full:dev`)
- [ ] Health check passes (`curl http://localhost:3001/health`)

## 🎯 One-Command Setup

**For the fastest setup, just run:**

```bash
npm run setup:xampp
```

**This will guide you through the entire process automatically!**

---

**Your NutriDash backend is now ready with XAMPP! 🎉**