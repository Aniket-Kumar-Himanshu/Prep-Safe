import express from 'express';
import { getAdminSettings, updateAdminSettings } from '../controllers/settingsController.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', adminMiddleware, getAdminSettings);
router.put('/', adminMiddleware, updateAdminSettings);

export default router;
