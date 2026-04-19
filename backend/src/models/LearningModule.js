import mongoose from 'mongoose';

const learningModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  disasterType: {
    type: String,
    enum: ['earthquake', 'flood', 'fire', 'cyclone'],
    required: true,
  },
  description: String,
  safetySteps: [{
    step: Number,
    description: String,
    illustration: String,
  }],
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
  }],
  estimatedTime: Number, // in minutes
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('LearningModule', learningModuleSchema);
