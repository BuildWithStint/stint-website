import { NextResponse } from 'next/server';
import { User } from '../../../lib/models/User';
import { withAuth, withCors, AuthenticatedRequest } from '../../../lib/middleware';

async function getUsersHandler(req: AuthenticatedRequest) {
  try {
    // Check if user is super user
    if (!req.user?.isSuperUser) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Super user privileges required.' },
        { status: 403 }
      );
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createUserHandler(req: AuthenticatedRequest) {
  try {
    // Check if user is super user
    if (!req.user?.isSuperUser) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Super user privileges required.' },
        { status: 403 }
      );
    }

    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user (regular admins, not super users)
    const user = new User({
      email,
      password,
      role: role || 'admin',
      isSuperUser: false // New users created by super admin are regular admins
    });

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isSuperUser: user.isSuperUser,
        createdAt: user.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withCors(withAuth(getUsersHandler));
export const POST = withCors(withAuth(createUserHandler));