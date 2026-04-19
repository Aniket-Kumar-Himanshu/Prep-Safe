import Quiz from '../models/Quiz.js';
import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, disasterType, questions, timeLimit, passingScore, assignedTo } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const quiz = new Quiz({
      title,
      description,
      disasterType,
      questions,
      timeLimit,
      passingScore,
      assignedTo,
      createdBy: req.user.userId,
    });

    await quiz.save();
    res.status(201).json({ 
      message: 'Quiz created successfully', 
      quiz 
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    let query = {};
    
    // If student, only show quizzes assigned to them or published quizzes with no specific assignment
    if (req.user.role === 'student') {
      query = {
        status: 'published',
        $or: [
          { assignedTo: req.user.userId }, // Quizzes specifically assigned to this student
          { assignedTo: { $exists: false } }, // Quizzes with no assignment (available to all)
          { assignedTo: { $size: 0 } } // Quizzes with empty assignment array (available to all)
        ]
      };
    } else if (req.user.role === 'teacher') {
      // Teachers see only their own quizzes
      query = { createdBy: req.user.userId };
    }
    // Admins see all quizzes (no query restriction)
    
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get quiz by ID (without answers for students)
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // If user is not teacher/admin, hide correct answers
    if (req.user.role === 'student') {
      const quizWithoutAnswers = quiz.toObject();
      quizWithoutAnswers.questions = quizWithoutAnswers.questions.map(q => ({
        question: q.question,
        options: q.options,
        points: q.points,
      }));
      return res.json(quizWithoutAnswers);
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update quiz
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const quiz = await Quiz.findByIdAndUpdate(id, updates, { new: true });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz updated successfully', quiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz answers
export const submitQuizAnswers = async (req, res) => {
  try {
    const { quizId, answers, timeSpent } = req.body;

    if (!quizId || !answers) {
      return res.status(400).json({ message: 'Quiz ID and answers are required' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    let totalPoints = 0;
    const processedAnswers = [];

    quiz.questions.forEach((question, index) => {
      totalPoints += question.points || 1;
      const userAnswer = answers.find(a => a.questionIndex === index);
      
      if (userAnswer) {
        const isCorrect = userAnswer.selectedAnswer === question.correctAnswer;
        const points = isCorrect ? (question.points || 1) : 0;
        score += points;

        processedAnswers.push({
          questionIndex: index,
          selectedAnswer: userAnswer.selectedAnswer,
          isCorrect,
          points,
        });
      }
    });

    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;

    // Save result
    const quizResult = new QuizResult({
      quizId,
      userId: req.user.userId,
      answers: processedAnswers,
      score,
      totalPoints,
      percentage,
      passed,
      timeSpent,
    });

    await quizResult.save();

    // Update user's preparedness score
    const user = await User.findById(req.user.userId);
    user.preparednessScore += Math.floor(percentage / 10);
    await user.save();

    res.json({
      message: 'Quiz submitted successfully',
      resultId: quizResult._id,
      result: {
        score,
        totalPoints,
        percentage,
        passed,
        correctAnswers: processedAnswers.filter(a => a.isCorrect).length,
        totalQuestions: quiz.questions.length,
      },
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get quiz results (for teachers)
export const getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;

    const results = await QuizResult.find({ quizId })
      .populate('userId', 'name email school')
      .sort({ completedAt: -1 });
    
    // Calculate statistics
    const stats = {
      totalAttempts: results.length,
      averageScore: results.reduce((sum, r) => sum + r.percentage, 0) / results.length || 0,
      passRate: (results.filter(r => r.passed).length / results.length * 100) || 0,
      highestScore: Math.max(...results.map(r => r.percentage), 0),
      lowestScore: Math.min(...results.map(r => r.percentage), 100),
    };

    res.json({ results, stats });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's quiz results
export const getUserQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user.userId })
      .populate('quizId', 'title disasterType')
      .sort({ completedAt: -1 });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching user quiz results:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get detailed quiz review (questions, answers, explanations)
export const getQuizReview = async (req, res) => {
  try {
    const { resultId } = req.params;

    // Find the quiz result
    const quizResult = await QuizResult.findById(resultId)
      .populate('quizId')
      .populate('userId', 'name email');

    if (!quizResult) {
      return res.status(404).json({ message: 'Quiz result not found' });
    }

    // Security: Ensure user can only view their own results
    if (quizResult.userId._id.toString() !== req.user.userId && req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quiz = quizResult.quizId;

    // Prepare detailed review with questions, answers, and explanations
    const reviewData = {
      quizTitle: quiz.title,
      quizDescription: quiz.description,
      disasterType: quiz.disasterType,
      score: quizResult.score,
      totalPoints: quizResult.totalPoints,
      percentage: quizResult.percentage,
      passed: quizResult.passed,
      timeSpent: quizResult.timeSpent,
      completedAt: quizResult.completedAt,
      questions: quiz.questions.map((question, index) => {
        const userAnswer = quizResult.answers.find(a => a.questionIndex === index);
        
        return {
          questionNumber: index + 1,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation || null,
          userAnswer: userAnswer ? userAnswer.selectedAnswer : null,
          isCorrect: userAnswer ? userAnswer.isCorrect : false,
          points: question.points || 1,
          earnedPoints: userAnswer ? userAnswer.points : 0,
        };
      }),
    };

    res.json(reviewData);
  } catch (error) {
    console.error('Error fetching quiz review:', error);
    res.status(500).json({ message: error.message });
  }
};
