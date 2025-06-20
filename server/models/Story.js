import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  location: {
    type: String,
    required: true,
    enum: ['town-square', 'bakery', 'library', 'park', 'workshop', 'theater']
  },
  town: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Town',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  themes: [{
    type: String,
    enum: ['cooking', 'crafts', 'nature', 'festival', 'seasons', 'mystery', 'community', 'animals']
  }],
  sentiment: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
storySchema.index({ town: 1, location: 1 });
storySchema.index({ town: 1, createdAt: -1 });

export default mongoose.model('Story', storySchema);