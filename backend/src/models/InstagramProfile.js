const mongoose = require('mongoose');

const instagramProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },
  fullName: {
    type: String,
    default: ''
  },
  biography: {
    type: String,
    default: ''
  },
  profilePicUrl: {
    type: String,
    default: ''
  },
  profilePicUrlHd: {
    type: String,
    default: ''
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isBusinessAccount: {
    type: Boolean,
    default: false
  },
  isProfessionalAccount: {
    type: Boolean,
    default: false
  },
  businessCategoryName: {
    type: String,
    default: ''
  },
  categoryName: {
    type: String,
    default: ''
  },
  externalUrl: {
    type: String,
    default: ''
  },
  followersCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  postsCount: {
    type: Number,
    default: 0
  },
  totalPosts: {
    type: Number,
    default: 0
  },
  recentPosts: [{
    id: String,
    shortcode: String,
    displayUrl: String,
    thumbnailUrl: String,
    isVideo: Boolean,
    videoUrl: String,
    caption: String,
    likesCount: Number,
    commentsCount: Number,
    timestamp: Date,
    location: String,
    hashtags: [String],
    mentions: [String]
  }],
  highlights: [{
    id: String,
    title: String,
    coverMediaUrl: String,
    mediaCount: Number
  }],
  stats: {
    engagementRate: {
      type: Number,
      default: 0
    },
    averageLikes: {
      type: Number,
      default: 0
    },
    averageComments: {
      type: Number,
      default: 0
    }
  },
  scrapedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  scrapeCount: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
instagramProfileSchema.index({ username: 1, scrapedAt: -1 });
instagramProfileSchema.index({ followersCount: -1 });
instagramProfileSchema.index({ postsCount: -1 });
instagramProfileSchema.index({ 'stats.engagementRate': -1 });
instagramProfileSchema.index({ isVerified: 1 });
instagramProfileSchema.index({ isBusinessAccount: 1 });

// Virtual for profile URL
instagramProfileSchema.virtual('profileUrl').get(function() {
  return `https://www.instagram.com/${this.username}/`;
});

// Virtual for follower ratio
instagramProfileSchema.virtual('followerRatio').get(function() {
  if (this.followingCount === 0) return 0;
  return (this.followersCount / this.followingCount).toFixed(2);
});

// Method to update profile data
instagramProfileSchema.methods.updateProfile = function(newData) {
  Object.assign(this, newData);
  this.lastUpdated = new Date();
  this.scrapeCount += 1;
  return this.save();
};

// Method to calculate engagement rate
instagramProfileSchema.methods.calculateEngagementRate = function() {
  if (!this.recentPosts || this.recentPosts.length === 0 || this.followersCount === 0) {
    return 0;
  }

  const totalEngagement = this.recentPosts.reduce((sum, post) => {
    return sum + (post.likesCount || 0) + (post.commentsCount || 0);
  }, 0);

  const avgEngagement = totalEngagement / this.recentPosts.length;
  return ((avgEngagement / this.followersCount) * 100).toFixed(2);
};

// Method to get profile summary
instagramProfileSchema.methods.getSummary = function() {
  return {
    username: this.username,
    fullName: this.fullName,
    followers: this.followersCount,
    following: this.followingCount,
    posts: this.postsCount,
    engagementRate: this.stats.engagementRate,
    isVerified: this.isVerified,
    isPrivate: this.isPrivate,
    isBusiness: this.isBusinessAccount,
    lastUpdated: this.lastUpdated,
    profileUrl: this.profileUrl
  };
};

// Static method to find profiles by criteria
instagramProfileSchema.statics.findByCriteria = function(criteria) {
  const query = {};
  
  if (criteria.minFollowers) {
    query.followersCount = { $gte: criteria.minFollowers };
  }
  
  if (criteria.maxFollowers) {
    query.followersCount = { ...query.followersCount, $lte: criteria.maxFollowers };
  }
  
  if (criteria.isVerified !== undefined) {
    query.isVerified = criteria.isVerified;
  }
  
  if (criteria.isBusiness !== undefined) {
    query.isBusinessAccount = criteria.isBusiness;
  }
  
  if (criteria.minEngagement) {
    query['stats.engagementRate'] = { $gte: criteria.minEngagement };
  }
  
  return this.find(query).sort({ followersCount: -1 });
};

// Static method to get trending profiles
instagramProfileSchema.statics.getTrending = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'stats.engagementRate': -1, followersCount: -1 })
    .limit(limit);
};

// Static method to get recently scraped profiles
instagramProfileSchema.statics.getRecentlyScraped = function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ lastUpdated: -1 })
    .limit(limit);
};

// Pre-save middleware to update stats
instagramProfileSchema.pre('save', function(next) {
  if (this.recentPosts && this.recentPosts.length > 0) {
    this.stats.engagementRate = parseFloat(this.calculateEngagementRate());
    
    const totalLikes = this.recentPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
    this.stats.averageLikes = Math.round(totalLikes / this.recentPosts.length);
    
    const totalComments = this.recentPosts.reduce((sum, post) => sum + (post.commentsCount || 0), 0);
    this.stats.averageComments = Math.round(totalComments / this.recentPosts.length);
  }
  
  next();
});

const InstagramProfile = mongoose.model('InstagramProfile', instagramProfileSchema);

module.exports = InstagramProfile; 