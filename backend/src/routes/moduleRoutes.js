import express from 'express';
import {
  createModule,
  getModules,
  getModuleById,
  completeModule,
  updateModule,
  deleteModule,
} from '../controllers/moduleController.js';
import { authMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', teacherMiddleware, createModule);
router.get('/', getModules);
router.get('/:id', getModuleById);
router.post('/:id/complete', authMiddleware, completeModule);
router.put('/:id', teacherMiddleware, updateModule);
router.delete('/:id', teacherMiddleware, deleteModule);

export default router;
