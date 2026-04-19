import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUsersStatistics,
  updateUser,
  deleteUser,
  assignModuleToStudents,
} from '../controllers/userController.js';
import { authMiddleware, adminMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/', teacherMiddleware, getAllUsers);
router.get('/admin/statistics', adminMiddleware, getUsersStatistics);
router.put('/:id', teacherMiddleware, updateUser);
router.delete('/:id', teacherMiddleware, deleteUser);
router.post('/assign-module', teacherMiddleware, assignModuleToStudents);

export default router;
