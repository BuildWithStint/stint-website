import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Project } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({})
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ error: 'Invalid input', details: errors.array() });
    }

    const { title, description, label, image, deploymentLink, accent } = req.body;

    console.log('Creating project with data:', {
      title,
      description: description?.substring(0, 50) + '...',
      label,
      imageLength: image?.length,
      imageStart: image?.substring(0, 50),
      deploymentLink,
      accent,
      createdBy: req.user?.userId
    });

    // Create new project
    const project = new Project({
      title,
      description,
      label,
      image,
      deploymentLink,
      accent,
      createdBy: req.user?.userId
    });

    await project.save();
    await project.populate('createdBy', 'email');

    res.status(201).json({
      success: true,
      project
    });
  } catch (error: any) {
    console.error('Create project error:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input', details: errors.array() });
    }

    const { id } = req.params;
    const { title, description, label, image, deploymentLink, accent } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { title, description, label, image, deploymentLink, accent },
      { new: true, runValidators: true }
    ).populate('createdBy', 'email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};