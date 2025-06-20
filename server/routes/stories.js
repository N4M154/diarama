import express from 'express';
import Story from '../models/Story.js';
import Town from '../models/Town.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { extractThemes, analyzeSentiment } from '../utils/textAnalysis.js';
import { generateTownCrest, generateTownMotto, updateTownStats } from '../utils/townUtils.js';

const router = express.Router();

// Add story to town
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { author, content, location, townId, shareId } = req.body;

    if (!author || !content || !location) {
      return res.status(400).json({ message: 'Author, content, and location are required' });
    }

    // Find town by ID or shareId
    let town;
    if (townId) {
      town = await Town.findById(townId);
    } else if (shareId) {
      town = await Town.findOne({ shareId });
    }

    if (!town) {
      return res.status(404).json({ message: 'Town not found' });
    }

    // Check permissions
    const isOwner = req.user && town.owner.toString() === req.user.userId;
    const isGuest = !req.user || !isOwner;

    if (isGuest && !town.allowGuestEntries) {
      return res.status(403).json({ message: 'Guest entries not allowed for this town' });
    }

    // Extract themes and analyze sentiment
    const themes = extractThemes(content);
    const sentiment = analyzeSentiment(content);

    // Create story
    const story = new Story({
      author: author.trim(),
      content: content.trim(),
      location,
      town: town._id,
      user: req.user?.userId,
      isGuest,
      themes,
      sentiment
    });

    await story.save();

    // Update town stats and regenerate crest/motto
    await updateTownStats(town._id);
    
    const allStories = await Story.find({ town: town._id });
    town.crest = generateTownCrest(allStories);
    town.motto = generateTownMotto(allStories);
    town.lastActivity = new Date();
    
    await town.save();

    res.status(201).json({ story });
  } catch (error) {
    console.error('Add story error:', error);
    res.status(500).json({ message: 'Server error adding story' });
  }
});

// Get stories for a town location
router.get('/town/:townId/location/:location', optionalAuth, async (req, res) => {
  try {
    const { townId, location } = req.params;

    const town = await Town.findById(townId);
    if (!town) {
      return res.status(404).json({ message: 'Town not found' });
    }

    // Check if town is public or user is owner
    const isOwner = req.user && town.owner.toString() === req.user.userId;
    if (!town.isPublic && !isOwner) {
      return res.status(403).json({ message: 'This town is private' });
    }

    const stories = await Story.find({ town: townId, location })
      .sort({ createdAt: -1 });

    res.json({ stories });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error fetching stories' });
  }
});

// Delete story (owner only)
router.delete('/:storyId', authenticateToken, async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId).populate('town');
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is town owner
    if (story.town.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this story' });
    }

    await Story.findByIdAndDelete(storyId);

    // Update town stats and regenerate crest/motto
    await updateTownStats(story.town._id);
    
    const allStories = await Story.find({ town: story.town._id });
    const town = story.town;
    town.crest = generateTownCrest(allStories);
    town.motto = generateTownMotto(allStories);
    town.lastActivity = new Date();
    
    await town.save();

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error deleting story' });
  }
});

export default router;