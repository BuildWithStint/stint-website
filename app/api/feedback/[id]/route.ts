import { NextRequest, NextResponse } from 'next/server';
import { Feedback } from '../../../../lib/models/Feedback';
import { withAuth, withDatabase, withCors, AuthenticatedRequest } from '../../../../lib/middleware';

async function updateFeedbackHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    const updateData = await req.json();

    // Only super users may publish (set isVisible: true).
    if (updateData.isVisible === true && !req.user?.isSuperUser) {
      return NextResponse.json(
        { success: false, error: 'Only a super admin can publish reviews' },
        { status: 403 }
      );
    }

    // Track approver. When unpublished, clear approvedBy.
    if (updateData.isVisible === true) {
      updateData.approvedBy = req.user?.id;
    } else if (updateData.isVisible === false) {
      updateData.approvedBy = null;
    }

    // Find and update the feedback
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'email');

    if (!feedback) {
      return NextResponse.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function deleteFeedbackHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return NextResponse.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getFeedbackHandler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    const feedback = await Feedback.findById(id).populate('createdBy', 'email');

    if (!feedback) {
      return NextResponse.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withCors(withDatabase(getFeedbackHandler));
export const PUT = withCors(withDatabase(withAuth(updateFeedbackHandler)));
export const DELETE = withCors(withDatabase(withAuth(deleteFeedbackHandler)));