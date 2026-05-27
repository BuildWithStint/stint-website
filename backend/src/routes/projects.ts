import { Router } from 'express';
import { body } from 'express-validator';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route to get projects (for main website)
router.get('/', getProjects);

// Admin routes
router.use(authenticateToken, requireAdmin);

// Create new project
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').trim().isLength({ min: 1, max: 1000 }),
  body('label').trim().isLength({ min: 1, max: 100 }),
  body('image').notEmpty().withMessage('Image is required'),
  body('deploymentLink').isURL(),
  body('accent').matches(/^#[0-9A-F]{6}$/i)
], createProject);

// Update project
router.put('/:id', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').trim().isLength({ min: 1, max: 1000 }),
  body('label').trim().isLength({ min: 1, max: 100 }),
  body('image').notEmpty().withMessage('Image is required'),
  body('deploymentLink').isURL(),
  body('accent').matches(/^#[0-9A-F]{6}$/i)
], updateProject);

// Delete project
router.delete('/:id', deleteProject);

export default router;