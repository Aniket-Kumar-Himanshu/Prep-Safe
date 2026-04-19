import express from 'express';
import {
  getVirtualDrills,
  getVirtualDrillById,
  createVirtualDrill,
  updateVirtualDrill,
  deleteVirtualDrill,
} from '../controllers/virtualDrillController.js';
import { authMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getVirtualDrills);
router.get('/:id', authMiddleware, getVirtualDrillById);
router.post('/', teacherMiddleware, createVirtualDrill);
router.put('/:id', teacherMiddleware, updateVirtualDrill);
router.delete('/:id', teacherMiddleware, deleteVirtualDrill);

export default router;
