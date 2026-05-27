import { NextResponse } from 'next/server';
import { User } from '../../../../lib/models/User';
import { withAuth, withCors, AuthenticatedRequest } from '../../../../lib/middleware';

async function profileHandler(req: AuthenticatedRequest) {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withCors(withAuth(profileHandler));