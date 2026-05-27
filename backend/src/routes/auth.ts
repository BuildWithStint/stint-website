import { Router } from 'express';
import { body } from 'express-validator';
import { login, refreshToken, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], login);

// Refresh token
router.post('/refresh', refreshToken);

// Get profile
router.get('/profile', authenticateToken, getProfile);

export default router;