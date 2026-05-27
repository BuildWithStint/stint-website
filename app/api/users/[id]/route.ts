import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../../lib/models/User';
import { withAuth, withCors, AuthenticatedRequest } from '../../../../lib/middleware';

async function deleteUserHandler(
  req: AuthenticatedRequest
) {
  try {
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

    // Check if this is the last admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userToDelete = await User.findById(id);
    
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