import { Router } from 'express';
import { body } from 'express-validator';
import { getContactSettings, updateContactSettings } from '../controllers/contactSettingsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route to get contact settings
router.get('/', getContactSettings);

// Admin routes
router.use(authenticateToken, requireAdmin);

// Update contact settings
router.put('/', [
  body('email').isEmail().normalizeEmail(),
  body('enquiryEmail').isEmail().normalizeEmail(),
  body('address').trim().isLength({ min: 1, max: 500 }),
  body('instagram').optional().isURL(),
  body('twitter').optional().isURL(),
  body('linkedin').optional().isURL()
], updateContactSettings);

export default router;
