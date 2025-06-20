import express from 'express';
import Town from '../models/Town.js';
import Story from '../models/Story.js';
import User from '../models/User.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { generateTownCrest, generateTownMotto } from '../utils/townUtils.js';

const router = express.Router();

// Create new town
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Town name is required' });
    }

    const town = new Town({
      name: name.trim(),
      owner: req.user.userId
    });

    await town.save();

    // Add town to user's towns
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { towns: town._id }
    });

    res.status(201).json({ town });
  } catch (error) {
    console.error('Create town error:', error);
    res.status(500).json({ message: 'Server error creating town' });
  }
});

// Get user's towns
router.get('/my-towns', authenticateToken, async (req, res) => {
  try {
    const towns = await Town.find({ owner: req.user.userId })
      .sort({ lastActivity: -1 });

    res.json({ towns });
  } catch (error) {
    console.error('Get towns error:', error);
    res.status(500).json({ message: 'Server error fetching towns' });
  }
});

// Get town by share ID (public access)
router.get('/share/:shareId', optionalAuth, async (req, res) => {
  try {
    const { shareId } = req.params;

    const town = await Town.findOne({ shareId })
      .populate('owner', 'username');

    if (!town) {
      return res.status(404).json({ message: 'Town not found' });
    }

    if (!town.isPublic && (!req.user || town.owner._id.toString() !== req.user.userId)) {
      return res.status(403).json({ message: 'This town is private' });
    }

    // Get stories for this town
    const stories = await Story.find({ town: town._id })
      .sort({ createdAt: -1 });

    // Update visitor count if not owner
    if (!req.user || town.owner._id.toString() !== req.user.userId) {
      await Town.findByIdAndUpdate(town._id, {
        $inc: { 'stats.totalVisitors': 1 }
      });
    }

    res.json({ town, stories });
  } catch (error) {
    console.error('Get town error:', error);
    res.status(500).json({ message: 'Server error fetching town' });
  }
});

// Update town
router.put('/:townId', authenticateToken, async (req, res) => {
  try {
    const { townId } = req.params;
    const { name, isPublic, allowGuestEntries } = req.body;

    const town = await Town.findOne({ _id: townId, owner: req.user.userId });

    if (!town) {
      return res.status(404).json({ message: 'Town not found or unauthorized' });
    }

    if (name) town.name = name.trim();
    if (typeof isPublic === 'boolean') town.isPublic = isPublic;
    if (typeof allowGuestEntries === 'boolean') town.allowGuestEntries = allowGuestEntries;

    town.lastActivity = new Date();
    await town.save();

    res.json({ town });
  } catch (error) {
    console.error('Update town error:', error);
    res.status(500).json({ message: 'Server error updating town' });
  }
});

// Delete town
router.delete('/:townId', authenticateToken, async (req, res) => {
  try {
    const { townId } = req.params;

    const town = await Town.findOne({ _id: townId, owner: req.user.userId });

    if (!town) {
      return res.status(404).json({ message: 'Town not found or unauthorized' });
    }

    // Delete all stories in this town
    await Story.deleteMany({ town: townId });

    // Remove town from user's towns
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { towns: townId }
    });

    // Delete the town
    await Town.findByIdAndDelete(townId);

    res.json({ message: 'Town deleted successfully' });
  } catch (error) {
    console.error('Delete town error:', error);
    res.status(500).json({ message: 'Server error deleting town' });
  }
});

// Regenerate town crest and motto
router.post('/:townId/regenerate', authenticateToken, async (req, res) => {
  try {
    const { townId } = req.params;

    const town = await Town.findOne({ _id: townId, owner: req.user.userId });

    if (!town) {
      return res.status(404).json({ message: 'Town not found or unauthorized' });
    }

    const stories = await Story.find({ town: townId });

    town.crest = generateTownCrest(stories);
    town.motto = generateTownMotto(stories);
    town.lastActivity = new Date();

    await town.save();

    res.json({ town });
  } catch (error) {
    console.error('Regenerate town error:', error);
    res.status(500).json({ message: 'Server error regenerating town' });
  }
});

export default router;