import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  disasterType: {
    type: String,
    enum: ['earthquake', 'flood', 'fire', 'cyclone', 'other'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  regions: [String],
  actionItems: [String],
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
});

export default mongoose.model('Alert', alertSchema);
