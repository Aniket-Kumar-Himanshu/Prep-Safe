import express from 'express';
import {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
} from '../controllers/alertController.js';
import { authMiddleware, adminMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', teacherMiddleware, createAlert);
router.get('/', authMiddleware, getAlerts);
router.get('/:id', getAlertById);
router.put('/:id', adminMiddleware, updateAlert);
router.delete('/:id', adminMiddleware, deleteAlert);

export default router;
