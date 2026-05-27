import { NextRequest, NextResponse } from 'next/server';
import { TeamMember } from '../../../lib/models/TeamMember';
import { withAuth, withDatabase, withCors, AuthenticatedRequest } from '../../../lib/middleware';

async function getTeamMembersHandler(req: NextRequest) {
  try {
    const teamMembers = await TeamMember.find().sort({ index: 1 });
    return NextResponse.json({ success: true, teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

async function createTeamMemberHandler(req: AuthenticatedRequest) {
  try {
    const { name, initials, role, bio, tools, accent, index } = await req.json();

    // Validate required fields
    if (!name || !initials || !role || !bio || !tools || !accent || !index) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate tools array
    if (!Array.isArray(tools) || tools.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one tool is required' },
        { status: 400 }
      );
    }

    const teamMember = new TeamMember({
      name,
      initials,
      role,
      bio,
      tools,
      accent,
      index
    });

    await teamMember.save();
    return NextResponse.json({ success: true, teamMember }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create team member' },
      { status: 500 }
    );
  }
}

export const GET = withCors(withDatabase(getTeamMembersHandler));
export const POST = withCors(withAuth(createTeamMemberHandler));