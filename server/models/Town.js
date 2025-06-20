import mongoose from 'mongoose';

const townSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shareId: {
    type: String,
    unique: true,
    required: true
  },
  crest: {
    type: String,
    default: ''
  },
  motto: {
    type: String,
    default: 'A town waiting to be discovered'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  allowGuestEntries: {
    type: Boolean,
    default: true
  },
  stats: {
    totalStories: {
      type: Number,
      default: 0
    },
    totalVisitors: {
      type: Number,
      default: 0
    },
    locationsWithStories: {
      type: Number,
      default: 0
    },
    contributors: {
      type: Number,
      default: 0
    }
  },
  themes: [{
    name: String,
    count: Number
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique share ID before validation
townSchema.pre('validate', function(next) {
  if (!this.shareId) {
    this.shareId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  next();
});

export default mongoose.model('Town', townSchema);