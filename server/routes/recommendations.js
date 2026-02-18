const express = require('express');
const prisma = require('../lib/prisma');
const { generateText } = require('ai');

const router = express.Router();

// Get AI-powered recommendations for user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user profile and preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        goalType: true,
        dietPreferences: true,
        allergies: true,
        healthConditions: true,
        targetCalories: true,
        targetProtein: true,
        weight: true,
        height: true,
        age: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user behavior data
    let userBehavior = await prisma.userBehavior.findUnique({
      where: { userId }
    });

    if (!userBehavior) {
      // Create initial behavior record
      userBehavior = await prisma.userBehavior.create({
        data: {
          userId,
          viewedMeals: [],
          purchasedMeals: [],
          ratedMeals: [],
          searchQueries: []
        }
      });
    }

    // Get meals that match user preferences
    const whereClause = {
      isActive: true,
      availability: true
    };

    // Filter by dietary preferences
    if (user.dietPreferences && user.dietPreferences.length > 0) {
      whereClause.OR = user.dietPreferences.map(pref => ({
        dietaryTags: { has: pref.toLowerCase() }
      }));
    }

    // Filter out allergens
    if (user.allergies && user.allergies.length > 0) {
      whereClause.allergens = {
        none: user.allergies
      };
    }

    // Get candidate meals
    const candidateMeals = await prisma.meal.findMany({
      where: whereClause,
      include: {
        ratings: {
          select: { rating: true }
        },
        _count: {
          select: { orderItems: true }
        }
      }
    });

    // Calculate match scores for each meal
    const scoredMeals = candidateMeals.map(meal => {
      let score = 0;

      // Goal-based scoring
      if (user.goalType === 'WEIGHT_LOSS' && meal.calories < 400) score += 20;
      if (user.goalType === 'MUSCLE_GAIN' && meal.protein > 25) score += 20;
      if (user.goalType === 'MAINTENANCE' && meal.calories >= 300 && meal.calories <= 500) score += 15;

      // Popularity scoring
      if (meal._count.orderItems > 50) score += 10;
      if (meal._count.orderItems > 100) score += 5;

      // Rating scoring
      const avgRating = meal.ratings.length > 0
        ? meal.ratings.reduce((sum, r) => sum + r.rating, 0) / meal.ratings.length
        : 0;
      score += avgRating * 4;

      // Behavioral scoring
      if (userBehavior.viewedMeals.includes(meal.id)) score += 5;
      if (userBehavior.purchasedMeals.includes(meal.id)) score += 15;

      // Health condition adjustments
      if (user.healthConditions?.includes('diabetes') && meal.carbs < 30) score += 10;
      if (user.healthConditions?.includes('hypertension') && meal.dietaryTags.includes('low-sodium')) score += 10;

      return {
        ...meal,
        matchScore: Math.min(score, 100),
        avgRating
      };
    });

    // Sort by match score and get top recommendations
    const topRecommendations = scoredMeals
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12);

    // Generate AI explanations for top recommendations
    const recommendationsWithAI = await Promise.all(
      topRecommendations.map(async (meal) => {
        let aiExplanation = '';
        
        try {
          if (process.env.OPENAI_API_KEY) {
            const prompt = `Generate a brief, personalized explanation (max 100 characters) for why "${meal.name}" is recommended for a user with:
- Goal: ${user.goalType || 'general health'}
- Health conditions: ${user.healthConditions?.join(', ') || 'none'}
- Dietary preferences: ${user.dietPreferences?.join(', ') || 'none'}

Meal: ${meal.calories} cal, ${meal.protein}g protein, ${meal.carbs}g carbs

Provide ONLY the explanation text.`;

            const { text } = await generateText({
              model: "openai/gpt-4o-mini",
              prompt,
              temperature: 0.7
            });

            aiExplanation = text.trim();
          }
        } catch (aiError) {
          console.error('AI explanation error:', aiError);
          // Fallback explanation
          aiExplanation = `Perfect for your ${user.goalType?.toLowerCase().replace('_', ' ') || 'health'} goals with ${meal.protein}g protein and ${meal.calories} calories.`;
        }

        return {
          id: meal.id,
          name: meal.name,
          description: meal.description,
          price: meal.price,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          image: meal.image,
          dietaryTags: meal.dietaryTags,
          matchScore: meal.matchScore,
          avgRating: meal.avgRating,
          aiExplanation,
          reason: getRecommendationReason(meal, user)
        };
      })
    );

    // Save recommendation to database
    await prisma.recommendation.create({
      data: {
        userId,
        meals: recommendationsWithAI,
        algorithm: 'v1.0'
      }
    });

    res.json({
      recommendations: recommendationsWithAI,
      userProfile: {
        goalType: user.goalType,
        targetCalories: user.targetCalories,
        dietPreferences: user.dietPreferences
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Refresh recommendations
router.post('/refresh', async (req, res) => {
  try {
    // Simply call the GET endpoint logic
    req.method = 'GET';
    return router.handle(req, res);
  } catch (error) {
    console.error('Refresh recommendations error:', error);
    res.status(500).json({ error: 'Failed to refresh recommendations' });
  }
});

// Track user interaction with recommendations
router.post('/track', async (req, res) => {
  try {
    const userId = req.user.id;
    const { action, mealId, searchQuery } = req.body;

    let updateData = {};

    switch (action) {
      case 'view':
        updateData = {
          viewedMeals: { push: mealId },
          lastActive: new Date()
        };
        break;
      case 'search':
        updateData = {
          searchQueries: { push: searchQuery },
          lastActive: new Date()
        };
        break;
      case 'purchase':
        updateData = {
          purchasedMeals: { push: mealId },
          lastActive: new Date()
        };
        break;
    }

    await prisma.userBehavior.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
        viewedMeals: action === 'view' ? [mealId] : [],
        purchasedMeals: action === 'purchase' ? [mealId] : [],
        searchQueries: action === 'search' ? [searchQuery] : []
      }
    });

    res.json({ message: 'Interaction tracked successfully' });
  } catch (error) {
    console.error('Track interaction error:', error);
    res.status(500).json({ error: 'Failed to track interaction' });
  }
});

// Get trending meals
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get meals ordered most in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingMeals = await prisma.meal.findMany({
      where: {
        isActive: true,
        availability: true,
        orderItems: {
          some: {
            order: {
              createdAt: {
                gte: sevenDaysAgo
              }
            }
          }
        }
      },
      include: {
        ratings: {
          select: { rating: true }
        },
        _count: {
          select: {
            orderItems: {
              where: {
                order: {
                  createdAt: {
                    gte: sevenDaysAgo
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      },
      take: parseInt(limit)
    });

    const trendingWithRatings = trendingMeals.map(meal => {
      const avgRating = meal.ratings.length > 0
        ? meal.ratings.reduce((sum, r) => sum + r.rating, 0) / meal.ratings.length
        : 0;

      return {
        ...meal,
        avgRating: Math.round(avgRating * 10) / 10,
        weeklyOrders: meal._count.orderItems
      };
    });

    res.json({ trending: trendingWithRatings });
  } catch (error) {
    console.error('Get trending meals error:', error);
    res.status(500).json({ error: 'Failed to fetch trending meals' });
  }
});

// Helper function to generate recommendation reason
function getRecommendationReason(meal, user) {
  const reasons = [];

  if (user.goalType === 'WEIGHT_LOSS' && meal.calories < 400) {
    reasons.push('Low calorie for weight loss');
  }
  if (user.goalType === 'MUSCLE_GAIN' && meal.protein > 25) {
    reasons.push('High protein for muscle building');
  }
  if (meal.dietaryTags.includes('high-fiber')) {
    reasons.push('Rich in fiber');
  }
  if (meal.dietaryTags.includes('low-fat')) {
    reasons.push('Low in fat');
  }
  if (user.healthConditions?.includes('diabetes') && meal.carbs < 30) {
    reasons.push('Diabetic-friendly');
  }

  return reasons.length > 0 ? reasons[0] : 'Recommended for you';
}

module.exports = router;