const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, 
    lowercase: true, 
    trim: true,
    // Updated regex supporting modern TLDs (.tech, .online, .co.uk, etc.)
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address']
  },
  password: {
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'staff'],
    default: 'user'
  },
  stats: {
    totalTestsTaken: { type: Number, default: 0 },
    totalSolved: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalWrong: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    lastTestDate: { type: Date }
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Single index for global leaderboard queries
UserSchema.index({ "stats.totalPoints": -1 });

// Compound index for role-filtered leaderboard queries (e.g., top 'user' accounts only)
UserSchema.index({ role: 1, "stats.totalPoints": -1 });

const User = mongoose.model('User', UserSchema);
module.exports = User;