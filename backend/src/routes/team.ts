import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from '../controllers/teamController';

const router = Router();

// Public route - get all team members
router.get('/', getTeamMembers);

// Protected routes - require admin authentication
router.post('/', authenticateToken, requireAdmin, createTeamMember);
router.put('/:id', authenticateToken, requireAdmin, updateTeamMember);
router.delete('/:id', authenticateToken, requireAdmin, deleteTeamMember);

export default router;
