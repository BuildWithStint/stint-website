import { Router } from 'express';
import { body } from 'express-validator';
import { getFeedbacks, getAllFeedbacks, createFeedback, updateFeedback, deleteFeedback } from '../controllers/feedbackController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route to get visible feedbacks (for main website)
router.get('/', getFeedbacks);

// Admin routes
router.use(authenticateToken, requireAdmin);

// Get all feedbacks (including hidden ones)
router.get('/all', getAllFeedbacks);

// Create new feedback
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('review').trim().isLength({ min: 1, max: 1000 }),
  body('company').optional().trim().isLength({ max: 100 }),
  body('position').optional().trim().isLength({ max: 100 }),
  body('isVisible').optional().isBoolean()
], createFeedback);

// Update feedback
router.put('/:id', [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('review').trim().isLength({ min: 1, max: 1000 }),
  body('company').optional().trim().isLength({ max: 100 }),
  body('position').optional().trim().isLength({ max: 100 }),
  body('isVisible').optional().isBoolean()
], updateFeedback);

// Delete feedback
router.delete('/:id', deleteFeedback);

export default router;
