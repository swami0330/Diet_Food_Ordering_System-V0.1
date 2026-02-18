const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const router = express.Router();

// Get ratings for a specific meal
router.get('/meal/:mealId', async (req, res) => {
  try {
    const { mealId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [ratings, totalCount, avgRating] = await Promise.all([
      prisma.rating.findMany({
        where: { mealId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.rating.count({ where: { mealId } }),
      prisma.rating.aggregate({
        where: { mealId },
        _avg: { rating: true }
      })
    ]);

    res.json({
      ratings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      },
      avgRating: avgRating._avg.rating || 0,
      totalRatings: totalCount
    });
  } catch (error) {
    console.error('Get meal ratings error:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Create or update rating
router.post('/', [
  body('mealId').isString().notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('review').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mealId, rating, review } = req.body;
    const userId = req.user.id;

    // Check if meal exists
    const meal = await prisma.meal.findUnique({
      where: { id: mealId }
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Check if user has purchased this meal (for verified reviews)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        mealId,
        order: {
          userId,
          status: 'DELIVERED'
        }
      }
    });

    // Create or update rating
    const ratingData = await prisma.rating.upsert({
      where: {
        userId_mealId: {
          userId,
          mealId
        }
      },
      update: {
        rating,
        review,
        verified: !!hasPurchased
      },
      create: {
        userId,
        mealId,
        rating,
        review,
        verified: !!hasPurchased
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: ratingData
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Update rating
router.put('/:id', [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('review').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    const updatedRating = await prisma.rating.update({
      where: {
        id,
        userId // Ensure user can only update their own ratings
      },
      data: {
        ...(rating && { rating }),
        ...(review !== undefined && { review })
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    res.json({
      message: 'Rating updated successfully',
      rating: updatedRating
    });
  } catch (error) {
    console.error('Update rating error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Rating not found' });
    }
    res.status(500).json({ error: 'Failed to update rating' });
  }
});

// Delete rating
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.rating.delete({
      where: {
        id,
        userId // Ensure user can only delete their own ratings
      }
    });

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Rating not found' });
    }
    res.status(500).json({ error: 'Failed to delete rating' });
  }
});

// Mark rating as helpful/unhelpful
router.post('/:id/helpful', [
  body('helpful').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { helpful } = req.body;

    const updateData = helpful 
      ? { helpful: { increment: 1 } }
      : { unhelpful: { increment: 1 } };

    const rating = await prisma.rating.update({
      where: { id },
      data: updateData,
      select: {
        helpful: true,
        unhelpful: true
      }
    });

    res.json({
      message: 'Feedback recorded',
      helpful: rating.helpful,
      unhelpful: rating.unhelpful
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Rating not found' });
    }
    res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// Get user's ratings
router.get('/my-ratings', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [ratings, totalCount] = await Promise.all([
      prisma.rating.findMany({
        where: { userId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          meal: {
            select: {
              name: true,
              image: true,
              price: true
            }
          }
        }
      }),
      prisma.rating.count({ where: { userId } })
    ]);

    res.json({
      ratings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ error: 'Failed to fetch your ratings' });
  }
});

// Get rating statistics for a meal
router.get('/meal/:mealId/stats', async (req, res) => {
  try {
    const { mealId } = req.params;

    const stats = await prisma.rating.groupBy({
      by: ['rating'],
      where: { mealId },
      _count: { rating: true }
    });

    const totalRatings = stats.reduce((sum, stat) => sum + stat._count.rating, 0);
    const avgRating = await prisma.rating.aggregate({
      where: { mealId },
      _avg: { rating: true }
    });

    // Create rating distribution
    const distribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    stats.forEach(stat => {
      distribution[stat.rating] = stat._count.rating;
    });

    res.json({
      totalRatings,
      avgRating: avgRating._avg.rating || 0,
      distribution
    });
  } catch (error) {
    console.error('Get rating stats error:', error);
    res.status(500).json({ error: 'Failed to fetch rating statistics' });
  }
});

module.exports = router;