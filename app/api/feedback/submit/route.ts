import { NextRequest, NextResponse } from 'next/server';
import { Feedback } from '../../../../lib/models/Feedback';
import { User } from '../../../../lib/models/User';
import { withDatabase, withCors } from '../../../../lib/middleware';

async function submitFeedbackHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, rating, review, company, position } = body || {};

    if (!name || !email || !rating || !review) {
      return NextResponse.json(
        { success: false, error: 'Name, email, rating, and review are required' },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (typeof review !== 'string' || review.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Review must be at least 10 characters' },
        { status: 400 }
      );
    }

    const owner = await User.findOne({ email: 'admin@stint.com' }).select('_id');
    if (!owner) {
      return NextResponse.json(
        { success: false, error: 'Submission temporarily unavailable' },
        { status: 503 }
      );
    }

    const feedback = new Feedback({
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().toLowerCase().slice(0, 200),
      rating: ratingNum,
      review: review.trim().slice(0, 1000),
      company: company ? String(company).trim().slice(0, 100) : undefined,
      position: position ? String(position).trim().slice(0, 100) : undefined,
      isVisible: false,
      createdBy: owner._id,
    });

    await feedback.save();

    return NextResponse.json(
      { success: true, message: 'Thank you. Your feedback has been received and will appear after review.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Invalid submission' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withCors(withDatabase(submitFeedbackHandler));
