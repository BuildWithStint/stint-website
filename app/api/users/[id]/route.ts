import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../../lib/models/User';
import { withAuth, withCors, AuthenticatedRequest } from '../../../../lib/middleware';

async function deleteUserHandler(
  req: AuthenticatedRequest
) {
  try {
    // Check if user is super user
    if (!req.user?.isSuperUser) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Super user privileges required.' },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent deleting yourself
    if (id === req.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Prevent deleting the default super admin
    const userToDelete = await User.findById(id);
    if (userToDelete?.email === 'admin@stint.com') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the default super admin account' },
        { status: 400 }
      );
    }

    // Check if this is the last admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (userToDelete?.role === 'admin' && adminCount === 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the last admin user' },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const DELETE = withCors(withAuth(deleteUserHandler));