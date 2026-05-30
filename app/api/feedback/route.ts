import { NextRequest, NextResponse } from 'next/server';
import { Feedback } from '../../../lib/models/Feedback';
import { withAuth, withDatabase, withCors, AuthenticatedRequest } from '../../../lib/middleware';

async function getFeedbacksHandler(req: NextRequest) {
  try {
    // Public route - only return reviews that are visible AND approved by a super user
    const feedbacks = await Feedback.aggregate([
      { $match: { isVisible: true, approvedBy: { $ne: null } } },
      {
        $lookup: {
          from: 'users',
          localField: 'approvedBy',
          foreignField: '_id',
          as: 'approver',
        },
      },
      { $match: { 'approver.isSuperUser': true } },
      {
        $project: {
          createdBy: 0,
          approvedBy: 0,
          approver: 0,
          email: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      feedbacks,
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

    const wantsVisible = isVisible !== undefined ? isVisible : true;
    const isSuper = !!req.user?.isSuperUser;

    // Only super users may publish a review directly; otherwise it stays pending.
    const finalVisible = wantsVisible && isSuper;

    const feedback = new Feedback({
      name,
      email,
      rating,
      review,
      company,
      position,
      isVisible: finalVisible,
      createdBy: req.user?.id,
      approvedBy: finalVisible ? req.user?.id : null,
    });

    await feedback.save();
    await feedback.populate('createdBy', 'email');

    return NextResponse.json({
      success: true,
      feedback,
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