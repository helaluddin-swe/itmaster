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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
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
    }
  }
});

// Added Index for Leaderboard Performance
UserSchema.index({ "stats.totalPoints": -1 });

const User = mongoose.model('User', UserSchema);
module.exports = User;