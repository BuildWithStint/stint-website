import { Router } from 'express';
import { body } from 'express-validator';
import { submitContactForm } from '../controllers/contactFormController';

const router = Router();

// Public route to submit contact form
router.post('/submit', [
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('project').trim().isLength({ min: 1, max: 2000 }),
  body('budget').optional().trim().isLength({ max: 50 })
], submitContactForm);

export default router;
