import express from 'express';
import {
  createDrill,
  getAllScheduledDrills,
  updateDrill,
  deleteDrill,
  saveDrillResult,
  getUserDrillResults,
  getAdminDrillStatistics,
  createSampleDrills,
  getAllDrills,
  updateDrillResult,
  deleteDrillResult,
} from '../controllers/drillController.js';
import { authMiddleware, adminMiddleware, teacherMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Scheduled drills (new endpoints)
router.post('/schedule', teacherMiddleware, createDrill);
router.get('/scheduled', teacherMiddleware, getAllScheduledDrills);
router.put('/scheduled/:id', teacherMiddleware, updateDrill);
router.delete('/scheduled/:id', teacherMiddleware, deleteDrill);

// Drill results (existing endpoints)
router.get('/', teacherMiddleware, getAllDrills);
router.post('/', authMiddleware, saveDrillResult);
router.get('/user/results', authMiddleware, getUserDrillResults);
router.post('/user/sample-data', authMiddleware, createSampleDrills);
router.get('/admin/statistics', adminMiddleware, getAdminDrillStatistics);
router.put('/:id', teacherMiddleware, updateDrillResult);
router.delete('/:id', teacherMiddleware, deleteDrillResult);

export default router;
