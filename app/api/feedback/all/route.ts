import { NextResponse } from 'next/server';
import { Feedback } from '../../../../lib/models/Feedback';
import { withAuth, withCors, AuthenticatedRequest } from '../../../../lib/middleware';

async function getAllFeedbacksHandler(req: AuthenticatedRequest) {
  try {
    // Admin route - return all feedbacks
    const feedbacks = await Feedback.find({})
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error('Get all feedbacks error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withCors(withAuth(getAllFeedbacksHandler));