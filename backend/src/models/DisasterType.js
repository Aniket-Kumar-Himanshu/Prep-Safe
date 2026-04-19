import mongoose from 'mongoose';

const disasterTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '🌍',
  },
  description: {
    type: String,
    required: true,
  },
  safetyTips: [{
    category: {
      type: String,
      enum: ['before', 'during', 'after'],
      required: true,
    },
    tip: {
      type: String,
      required: true,
    },
  }],
  emergencySupplies: [String],
  warningSignals: [String],
  evacuationGuidelines: String,
  commonInRegions: [String],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
disasterTypeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('DisasterType', disasterTypeSchema);
