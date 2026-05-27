import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Feedback } from '../models/Feedback';
import { AuthRequest } from '../middleware/auth';

export const getFeedbacks = async (req: AuthRequest, res: Response) => {
  try {
    // Public route - only return visible feedbacks
    const feedbacks = await Feedback.find({ isVisible: true })
      .select('-createdBy')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllFeedbacks = async (req: AuthRequest, res: Response) => {
  try {
    // Admin route - return all feedbacks
    const feedbacks = await Feedback.find({})
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error('Get all feedbacks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createFeedback = async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input', details: errors.array() });
    }

    const { name, email, rating, review, company, position, isVisible } = req.body;

    // Create new feedback
    const feedback = new Feedback({
      name,
      email,
      rating,
      review,
      company,
      position,
      isVisible: isVisible !== undefined ? isVisible : true,
      createdBy: req.user?.userId
    });

    await feedback.save();
    await feedback.populate('createdBy', 'email');

    res.status(201).json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateFeedback = async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input', details: errors.array() });
    }

    const { id } = req.params;
    const { name, email, rating, review, company, position, isVisible } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { name, email, rating, review, company, position, isVisible },
      { new: true, runValidators: true }
    ).populate('createdBy', 'email');

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
