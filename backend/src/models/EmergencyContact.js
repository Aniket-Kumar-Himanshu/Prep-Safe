import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['hospital', 'fire_department', 'police', 'helpline', 'other'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: String,
  address: String,
  region: String,
  latitude: Number,
  longitude: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('EmergencyContact', emergencyContactSchema);
