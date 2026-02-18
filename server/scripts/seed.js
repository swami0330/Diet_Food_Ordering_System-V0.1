const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for MySQL...');

  // Create subscription plans
  console.log('Creating subscription plans...');
  const plans = await Promise.all([
    prisma.subscriptionPlan.upsert({
      where: { id: 'basic-plan' },
      update: {},
      create: {
        id: 'basic-plan',
        name: 'Basic Plan',
        mealsPerDay: 2,
        daysPerWeek: 5,
        price: 149,
        features: ['2 meals daily', '5 days a week', 'Standard delivery', 'Basic meal customization']
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: 'standard-plan' },
      update: {},
      create: {
        id: 'standard-plan',
        name: 'Standard Plan',
        mealsPerDay: 3,
        daysPerWeek: 6,
        price: 249,
        features: ['3 meals daily', '6 days a week', 'Priority delivery', 'Full meal customization', 'Nutritionist consultation']
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: 'premium-plan' },
      update: {},
      create: {
        id: 'premium-plan',
        name: 'Premium Plan',
        mealsPerDay: 3,
        daysPerWeek: 7,
        price: 349,
        features: ['3 meals daily', '7 days a week', 'Express delivery', 'Premium ingredients', 'Personal nutritionist', '24/7 support']
      }
    })
  ]);

  // Create sample meals
  console.log('Creating sample meals...');
  const meals = [
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
      planType: 'WEIGHT_LOSS',
      mealTime: 'LUNCH',
      dietType: 'NON_VEG',
      ingredients: ['chicken breast', 'mixed greens', 'cherry tomatoes', 'balsamic vinegar', 'olive oil'],
      allergens: [],
      preparationTime: 15
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
      planType: 'MAINTENANCE',
      mealTime: 'LUNCH',
      dietType: 'VEGAN',
      ingredients: ['quinoa', 'roasted vegetables', 'avocado', 'tahini', 'lemon'],
      allergens: ['sesame'],
      preparationTime: 20
    },
    {
      id: 'meal-003',
      name: 'Oats with Berries',
      description: 'Wholesome rolled oats with mixed berries, honey, and chia seeds',
      price: 150,
      calories: 250,
      protein: 8,
      carbs: 45,
      fats: 5,
      image: '/oats-with-fresh-fruits-and-honey.jpg',
      dietaryTags: ['veg', 'high-fiber', 'low-fat'],
      goals: ['weight-loss'],
      planType: 'WEIGHT_LOSS',
      mealTime: 'BREAKFAST',
      dietType: 'VEG',
      ingredients: ['rolled oats', 'mixed berries', 'honey', 'chia seeds', 'milk'],
      allergens: ['dairy'],
      preparationTime: 10
    },
    {
      id: 'meal-004',
      name: 'Grilled Salmon with Asparagus',
      description: 'Fresh Atlantic salmon with grilled asparagus and lemon herb seasoning',
      price: 280,
      calories: 420,
      protein: 40,
      carbs: 8,
      fats: 25,
      image: '/grilled-salmon-asparagus.jpg',
      dietaryTags: ['high-protein', 'omega-3', 'low-carb'],
      goals: ['muscle-gain', 'maintenance'],
      planType: 'MUSCLE_GAIN',
      mealTime: 'DINNER',
      dietType: 'NON_VEG',
      ingredients: ['salmon fillet', 'asparagus', 'lemon', 'herbs', 'olive oil'],
      allergens: ['fish'],
      preparationTime: 25
    },
    {
      id: 'meal-005',
      name: 'Paneer Butter Masala with Roti',
      description: 'Creamy paneer curry with whole wheat roti and mint chutney',
      price: 200,
      calories: 480,
      protein: 22,
      carbs: 35,
      fats: 28,
      image: '/paneer-butter-masala-with-roti.jpg',
      dietaryTags: ['vegetarian', 'indian', 'protein-rich'],
      goals: ['maintenance', 'muscle-gain'],
      planType: 'MAINTENANCE',
      mealTime: 'DINNER',
      dietType: 'VEG',
      ingredients: ['paneer', 'tomatoes', 'cream', 'whole wheat flour', 'spices'],
      allergens: ['dairy', 'gluten'],
      preparationTime: 30
    },
    {
      id: 'meal-006',
      name: 'Mediterranean Salad',
      description: 'Fresh Mediterranean salad with olives, feta cheese, and olive oil dressing',
      price: 170,
      calories: 290,
      protein: 12,
      carbs: 18,
      fats: 22,
      image: '/mediterranean-salad.png',
      dietaryTags: ['vegetarian', 'mediterranean', 'fresh'],
      goals: ['weight-loss', 'maintenance'],
      planType: 'WEIGHT_LOSS',
      mealTime: 'LUNCH',
      dietType: 'VEG',
      ingredients: ['mixed greens', 'olives', 'feta cheese', 'tomatoes', 'cucumber', 'olive oil'],
      allergens: ['dairy'],
      preparationTime: 10
    },
    {
      id: 'meal-007',
      name: 'Turkey Chili',
      description: 'Hearty turkey chili with beans and vegetables, perfect for muscle building',
      price: 220,
      calories: 380,
      protein: 32,
      carbs: 28,
      fats: 15,
      image: '/turkey-chili.png',
      dietaryTags: ['high-protein', 'hearty', 'comfort-food'],
      goals: ['muscle-gain', 'maintenance'],
      planType: 'MUSCLE_GAIN',
      mealTime: 'DINNER',
      dietType: 'NON_VEG',
      ingredients: ['ground turkey', 'kidney beans', 'tomatoes', 'onions', 'bell peppers', 'spices'],
      allergens: [],
      preparationTime: 35
    },
    {
      id: 'meal-008',
      name: 'Smoothie Bowl',
      description: 'Colorful smoothie bowl with fresh fruits, granola, and coconut flakes',
      price: 140,
      calories: 320,
      protein: 10,
      carbs: 55,
      fats: 8,
      image: '/colorful-smoothie-bowl.png',
      dietaryTags: ['vegan', 'fresh', 'energizing'],
      goals: ['weight-loss', 'maintenance'],
      planType: 'MAINTENANCE',
      mealTime: 'BREAKFAST',
      dietType: 'VEGAN',
      ingredients: ['mixed berries', 'banana', 'granola', 'coconut flakes', 'almond milk'],
      allergens: ['nuts'],
      preparationTime: 8
    }
  ];

  for (const meal of meals) {
    await prisma.meal.upsert({
      where: { id: meal.id },
      update: {},
      create: meal
    });
  }

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.admin.upsert({
    where: { email: 'admin@nutridash.com' },
    update: {},
    create: {
      email: 'admin@nutridash.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      permissions: ['*']
    }
  });

  // Create test user
  console.log('Creating test user...');
  const testUserPassword = await bcrypt.hash('password', 12);
  await prisma.user.upsert({
    where: { email: 'test@nutridash.com' },
    update: {},
    create: {
      email: 'test@nutridash.com',
      password: testUserPassword,
      name: 'Test User',
      phone: '+919876543210',
      age: 28,
      weight: 70,
      height: 175,
      gender: 'MALE',
      goalType: 'WEIGHT_LOSS',
      targetCalories: 1800,
      targetProtein: 120,
      healthConditions: ['none'],
      dietPreferences: ['vegetarian'],
      allergies: []
    }
  });

  // Create sample delivery partner
  console.log('Creating delivery partner...');
  await prisma.deliveryPartner.upsert({
    where: { email: 'delivery@nutridash.com' },
    update: {},
    create: {
      name: 'Raj Kumar',
      phone: '+919876543210',
      email: 'delivery@nutridash.com',
      vehicle: 'Motorcycle',
      rating: 4.8,
      totalDeliveries: 150,
      status: 'ACTIVE'
    }
  });

  // Create sample coupons
  console.log('Creating sample coupons...');
  const coupons = [
    {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 200,
      maxUses: 1000,
      expiryDate: new Date('2024-12-31')
    },
    {
      code: 'FLAT50',
      discountType: 'FIXED',
      discountValue: 50,
      minOrderValue: 300,
      maxUses: 500,
      expiryDate: new Date('2024-12-31')
    },
    {
      code: 'HEALTHY20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 500,
      maxUses: 200,
      expiryDate: new Date('2024-12-31')
    }
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon
    });
  }

  // Create tax configurations
  console.log('Creating tax configurations...');
  const taxConfigs = [
    {
      country: 'India',
      state: 'Maharashtra',
      taxType: 'GST',
      taxRate: 18.0
    },
    {
      country: 'India',
      state: 'Karnataka',
      taxType: 'GST',
      taxRate: 18.0
    },
    {
      country: 'India',
      state: 'Delhi',
      taxType: 'GST',
      taxRate: 18.0
    },
    {
      country: 'India',
      state: 'Tamil Nadu',
      taxType: 'GST',
      taxRate: 18.0
    }
  ];

  for (const taxConfig of taxConfigs) {
    await prisma.taxConfiguration.upsert({
      where: { 
        country_state_taxType: {
          country: taxConfig.country,
          state: taxConfig.state,
          taxType: taxConfig.taxType
        }
      },
      update: {},
      create: taxConfig
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Created:');
  console.log('  - 3 subscription plans (Basic, Standard, Premium)');
  console.log('  - 8 sample meals with complete nutrition data');
  console.log('  - 1 admin user (admin@nutridash.com / admin123)');
  console.log('  - 1 test user (test@nutridash.com / password)');
  console.log('  - 1 delivery partner');
  console.log('  - 3 sample coupons (WELCOME10, FLAT50, HEALTHY20)');
  console.log('  - 4 tax configurations for Indian states');
  console.log('');
  console.log('🚀 Your NutriDash database is ready!');
  console.log('📱 You can now start the backend server with: npm run server:full:dev');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });