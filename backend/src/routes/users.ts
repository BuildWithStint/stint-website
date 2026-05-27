import { Router } from 'express';
import { body } from 'express-validator';
import { getUsers, createUser, deleteUser } from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken, requireAdmin);

// Get all users
router.get('/', getUsers);

// Create new user
router.post('/', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'user'])
], createUser);

// Delete user
router.delete('/:id', deleteUser);

export default router;