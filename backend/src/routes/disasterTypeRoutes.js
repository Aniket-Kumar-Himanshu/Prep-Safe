import express from 'express';
import {
  getAllDisasterTypes,
  getDisasterTypeById,
  createDisasterType,
  updateDisasterType,
  deleteDisasterType,
  getDisasterStatistics,
} from '../controllers/disasterTypeController.js';
import { authMiddleware, adminMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllDisasterTypes);
router.get('/statistics', teacherMiddleware, getDisasterStatistics);
router.get('/:id', getDisasterTypeById);
router.post('/', teacherMiddleware, createDisasterType);
router.put('/:id', teacherMiddleware, updateDisasterType);
router.delete('/:id', adminMiddleware, deleteDisasterType);

export default router;
