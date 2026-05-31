import { NextRequest, NextResponse } from 'next/server';
import { TeamMember } from '../../../../lib/models/TeamMember';
import { withAuth, withDatabase, withCors, AuthenticatedRequest } from '../../../../lib/middleware';

async function updateTeamMemberHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Team member ID is required' },
        { status: 400 }
      );
    }

    const updateData = await req.json();

    // Find and update the team member
    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      teamMember
    });
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function deleteTeamMemberHandler(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Team member ID is required' },
        { status: 400 }
      );
    }

    const teamMember = await TeamMember.findByIdAndDelete(id);

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getTeamMemberHandler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Team member ID is required' },
        { status: 400 }
      );
    }

    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      teamMember
    });
  } catch (error) {
    console.error('Get team member error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withCors(withDatabase(getTeamMemberHandler));
export const PUT = withCors(withDatabase(withAuth(updateTeamMemberHandler)));
export const DELETE = withCors(withDatabase(withAuth(deleteTeamMemberHandler)));