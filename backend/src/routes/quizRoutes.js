import express from 'express';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuizAnswers,
  getQuizResults,
  getUserQuizResults,
  getQuizReview,
} from '../controllers/quizController.js';
import { authMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Quiz management (teachers)
router.post('/', teacherMiddleware, createQuiz);
router.get('/', authMiddleware, getAllQuizzes);
router.get('/:id', authMiddleware, getQuizById);
router.put('/:id', teacherMiddleware, updateQuiz);
router.delete('/:id', teacherMiddleware, deleteQuiz);

// Quiz attempts (students)
router.post('/submit', authMiddleware, submitQuizAnswers);
router.get('/user/results', authMiddleware, getUserQuizResults);
router.get('/review/:resultId', authMiddleware, getQuizReview);

// Quiz results (teachers)
router.get('/:quizId/results', teacherMiddleware, getQuizResults);

export default router;
