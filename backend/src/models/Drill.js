import mongoose from 'mongoose';

const drillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  disasterType: {
    type: String,
    enum: ['earthquake', 'flood', 'fire', 'cyclone'],
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  class: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Drill', drillSchema);
