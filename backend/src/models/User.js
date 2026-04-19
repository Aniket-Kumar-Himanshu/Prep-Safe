import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  school: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  preparednessScore: {
    type: Number,
    default: 0,
  },
  badges: [{
    name: String,
    earnedAt: Date,
  }],
  completedModules: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
    score: Number,
  }],
  assignedModules: [{
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningModule',
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dueDate: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
