import mongoose from 'mongoose';

const virtualDrillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    disasterType: {
      type: String,
      enum: ['earthquake', 'flood', 'fire', 'cyclone'],
      required: true,
    },
    icon: {
      type: String,
      default: '🧪',
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('VirtualDrill', virtualDrillSchema);
