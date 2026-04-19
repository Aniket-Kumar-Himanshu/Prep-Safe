import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', adminMiddleware, createContact);
router.get('/', getContacts);
router.get('/:id', getContactById);
router.put('/:id', adminMiddleware, updateContact);
router.delete('/:id', adminMiddleware, deleteContact);

export default router;
