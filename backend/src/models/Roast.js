const mongoose = require('mongoose');

const roastSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roast_text: {
    type: String,
    required: true,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
roastSchema.index({ user_id: 1 });
roastSchema.index({ created_at: -1 });

module.exports = mongoose.model('Roast', roastSchema); 