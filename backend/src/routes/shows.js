import express from 'express';
import Show from '../models/Show.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

// Get all shows with pagination, search, and filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;
    const search = req.query.q;
    const type = req.query.type;
    const genre = req.query.genre;

    // Build query
    const query = {};

    // Age restriction: hide R-rated content for users under 18
    if (user.age < 18) {
      query.rating = { $ne: 'R' };
    }

    // Type filter
    if (type && (type === 'Movie' || type === 'TV Show')) {
      query.type = type;
    }

    // Genre filter
    if (genre) {
      query.listed_in = { $in: [new RegExp(genre, 'i')] };
    }

    // Search filter (title and cast)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { cast: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Execute query
    const [shows, total] = await Promise.all([
      Show.find(query).skip(skip).limit(limit).lean(),
      Show.countDocuments(query),
    ]);

    res.json({
      shows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get shows error:', error);
    res.status(500).json({ error: error.message || 'Failed to get shows' });
  }
});

// Get show by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    // Try to find by MongoDB _id first, then by show_id
    let show = await Show.findById(req.params.id).lean();
    if (!show) {
      show = await Show.findOne({ show_id: req.params.id }).lean();
    }

    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    // Check age restriction
    if (user.age < 18 && show.rating === 'R') {
      return res.status(403).json({ error: 'Content not available for your age' });
    }

    res.json(show);
  } catch (error) {
    console.error('Get show error:', error);
    res.status(500).json({ error: error.message || 'Failed to get show' });
  }
});

// Get recommendations based on show genres
router.get('/:id/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    // Try to find by MongoDB _id first, then by show_id
    let show = await Show.findById(req.params.id).lean();
    if (!show) {
      show = await Show.findOne({ show_id: req.params.id }).lean();
    }

    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }

    // Check age restriction
    if (user.age < 18 && show.rating === 'R') {
      return res.status(403).json({ error: 'Content not available for your age' });
    }

    // Build query for recommendations
    const query = {
      _id: { $ne: show._id },
    };

    // Age restriction
    if (user.age < 18) {
      query.rating = { $ne: 'R' };
    }

    // Match genres
    if (show.listed_in && show.listed_in.length > 0) {
      query.listed_in = { $in: show.listed_in };
    }

    // Get recommendations (limit to 10)
    const recommendations = await Show.find(query).limit(10).lean();

    res.json({ recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: error.message || 'Failed to get recommendations' });
  }
});

export default router;


