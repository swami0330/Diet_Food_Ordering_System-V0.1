const express = require('express');
const { query, body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { authenticateAdmin, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Get all meals with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('dietType').optional().isIn(['VEG', 'NON_VEG', 'VEGAN']),
  query('mealTime').optional().isIn(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  query('planType').optional().isIn(['WEIGHT_LOSS', 'WEIGHT_GAIN', 'MAINTENANCE']),
  query('minCalories').optional().isInt({ min: 0 }),
  query('maxCalories').optional().isInt({ min: 0 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sortBy').optional().isIn(['name', 'price', 'calories', 'createdAt']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      search,
      dietType,
      mealTime,
      planType,
      minCalories,
      maxCalories,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      isActive: true,
      availability: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { dietaryTags: { has: search.toLowerCase() } }
        ]
      }),
      ...(dietType && { dietType }),
      ...(mealTime && { mealTime }),
      ...(planType && { planType }),
      ...(minCalories && { calories: { gte: parseInt(minCalories) } }),
      ...(maxCalories && { calories: { lte: parseInt(maxCalories) } }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } })
    };

    // Get meals with pagination
    const [meals, totalCount] = await Promise.all([
      prisma.meal.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          ratings: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              ratings: true,
              orderItems: true
            }
          }
        }
      }),
      prisma.meal.count({ where })
    ]);

    // Calculate average ratings
    const mealsWithRatings = meals.map(meal => {
      const avgRating = meal.ratings.length > 0
        ? meal.ratings.reduce((sum, r) => sum + r.rating, 0) / meal.ratings.length
        : 0;

      const { ratings, ...mealData } = meal;
      return {
        ...mealData,
        avgRating: Math.round(avgRating * 10) / 10,
        totalRatings: meal._count.ratings,
        totalOrders: meal._count.orderItems
      };
    });

    res.json({
      meals: mealsWithRatings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Get single meal by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            ratings: true,
            orderItems: true
          }
        }
      }
    });

    if (!meal || !meal.isActive) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Calculate average rating
    const avgRating = meal.ratings.length > 0
      ? meal.ratings.reduce((sum, r) => sum + r.rating, 0) / meal.ratings.length
      : 0;

    res.json({
      ...meal,
      avgRating: Math.round(avgRating * 10) / 10,
      totalRatings: meal._count.ratings,
      totalOrders: meal._count.orderItems
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
});

// Get meal suggestions based on user preferences
router.get('/suggestions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        goalType: true,
        dietPreferences: true,
        allergies: true,
        healthConditions: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build filter based on user preferences
    const where = {
      isActive: true,
      availability: true,
      ...(user.goalType && {
        goals: {
          has: user.goalType.toLowerCase().replace('_', '-')
        }
      })
    };

    // Filter out allergens
    if (user.allergies && user.allergies.length > 0) {
      where.allergens = {
        none: user.allergies
      };
    }

    const suggestedMeals = await prisma.meal.findMany({
      where,
      take: 12,
      orderBy: [
        { calories: user.goalType === 'WEIGHT_LOSS' ? 'asc' : 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        ratings: {
          select: { rating: true }
        },
        _count: {
          select: { ratings: true }
        }
      }
    });

    // Calculate average ratings
    const mealsWithRatings = suggestedMeals.map(meal => {
      const avgRating = meal.ratings.length > 0
        ? meal.ratings.reduce((sum, r) => sum + r.rating, 0) / meal.ratings.length
        : 0;

      const { ratings, ...mealData } = meal;
      return {
        ...mealData,
        avgRating: Math.round(avgRating * 10) / 10,
        totalRatings: meal._count.ratings
      };
    });

    res.json({ suggestions: mealsWithRatings });
  } catch (error) {
    console.error('Get meal suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch meal suggestions' });
  }
});

// Admin routes for meal management
router.post('/', [
  authenticateAdmin,
  checkPermission('manage_meals'),
  body('name').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('price').isFloat({ min: 0 }),
  body('calories').isInt({ min: 0 }),
  body('protein').isFloat({ min: 0 }),
  body('carbs').isFloat({ min: 0 }),
  body('fats').isFloat({ min: 0 }),
  body('image').isURL(),
  body('dietaryTags').isArray(),
  body('goals').isArray(),
  body('dietType').isIn(['VEG', 'NON_VEG', 'VEGAN']),
  body('mealTime').optional().isIn(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  body('planType').optional().isIn(['WEIGHT_LOSS', 'WEIGHT_GAIN', 'MAINTENANCE'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const meal = await prisma.meal.create({
      data: req.body
    });

    res.status(201).json({
      message: 'Meal created successfully',
      meal
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

// Update meal (Admin only)
router.put('/:id', [
  authenticateAdmin,
  checkPermission('manage_meals')
], async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await prisma.meal.update({
      where: { id },
      data: req.body
    });

    res.json({
      message: 'Meal updated successfully',
      meal
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

// Delete meal (Admin only)
router.delete('/:id', [
  authenticateAdmin,
  checkPermission('manage_meals')
], async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete
    await prisma.meal.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

module.exports = router;