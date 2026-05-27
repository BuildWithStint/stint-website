import { Request, Response } from 'express';
import { TeamMember } from '../models/TeamMember';

// Get all team members
export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const teamMembers = await TeamMember.find().sort({ index: 1 });
    res.json({ success: true, teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch team members' });
  }
};

// Create a new team member
export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const { name, initials, role, bio, tools, accent, index } = req.body;

    // Validate required fields
    if (!name || !initials || !role || !bio || !tools || !accent || !index) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Validate tools array
    if (!Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one tool is required' });
    }

    const teamMember = new TeamMember({
      name,
      initials,
      role,
      bio,
      tools,
      accent,
      index
    });

    await teamMember.save();
    res.status(201).json({ success: true, teamMember });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create team member' });
  }
};

// Update a team member
export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'Team member not found' });
    }

    res.json({ success: true, teamMember });
  } catch (error: any) {
    console.error('Error updating team member:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to update team member' });
  }
};

// Delete a team member
export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findByIdAndDelete(id);

    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'Team member not found' });
    }

    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ success: false, error: 'Failed to delete team member' });
  }
};
