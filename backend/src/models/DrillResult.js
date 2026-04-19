import mongoose from 'mongoose';

const drillResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  drillType: {
    type: String,
    enum: ['earthquake', 'flood', 'fire', 'cyclone'],
    required: true,
  },
  scenario: String,
  userChoices: [
    {
      question: String,
      chosen: String,
      correct: String,
      isCorrect: Boolean,
    }
  ],
  score: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    default: 100,
  },
  feedback: String,
  duration: Number, // in seconds
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('DrillResult', drillResultSchema);
