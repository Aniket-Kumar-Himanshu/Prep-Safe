import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  disasterType: {
    type: String,
    enum: ['earthquake', 'flood', 'fire', 'cyclone', 'general'],
    default: 'general',
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: Number,
      required: true,
    },
    explanation: String,
    points: {
      type: Number,
      default: 1,
    },
  }],
  timeLimit: {
    type: Number, // in minutes
    default: 30,
  },
  passingScore: {
    type: Number,
    default: 70,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Quiz', quizSchema);
