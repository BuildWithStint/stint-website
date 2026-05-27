import { NextRequest, NextResponse } from 'next/server';
import { Feedback } from '../../../lib/models/Feedback';
import { withAuth, withDatabase, withCors, AuthenticatedRequest } from '../../../lib/middleware';

async function getFeedbacksHandler(req: NextRequest) {
  try {
    // Public route - only return visible feedbacks
    const feedbacks = await Feedback.find({ isVisible: true })
      .select('-createdBy')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createFeedbackHandler(req: AuthenticatedRequest) {
  try {
    const { name, email, rating, review, company, position, isVisible } = await req.json();

    if (!name || !email || !rating || !review) {
      return NextResponse.json(
        { success: false, error: 'Name, email, rating, and review are required' },
        { status: 400 }
      );
    }

    // Create new feedback
    const feedback = new Feedback({
      name,
      email,
      rating,
      review,
      company,
      position,
      isVisible: isVisible !== undefined ? isVisible : true,
      createdBy: req.user?.id
    });

    await feedback.save();
    await feedback.populate('createdBy', 'email');

    return NextResponse.json({
      success: true,
      feedback
    }, { status: 201 });
  } catch (error) {
    console.error('Create feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withCors(withDatabase(getFeedbacksHandler));
export const POST = withCors(withAuth(createFeedbackHandler));