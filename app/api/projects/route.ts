import { NextRequest, NextResponse } from 'next/server';
import { Project } from '../../../lib/models/Project';
import { withAuth, withDatabase, withCors, AuthenticatedRequest } from '../../../lib/middleware';

async function getProjectsHandler(req: NextRequest) {
  try {
    const projects = await Project.find({})
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createProjectHandler(req: AuthenticatedRequest) {
  try {
    const { title, description, label, image, deploymentLink, accent } = await req.json();

    if (!title || !description || !label) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and label are required' },
        { status: 400 }
      );
    }

    console.log('Creating project with data:', {
      title,
      description: description?.substring(0, 50) + '...',
      label,
      imageLength: image?.length,
      imageStart: image?.substring(0, 50),
      deploymentLink,
      accent,
      createdBy: req.user?.id
    });

    // Create new project
    const project = new Project({
      title,
      description,
      label,
      image,
      deploymentLink,
      accent,
      createdBy: req.user?.id
    });

    await project.save();
    await project.populate('createdBy', 'email');

    return NextResponse.json({
      success: true,
      project
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export const GET = withCors(withDatabase(getProjectsHandler));
export const POST = withCors(withAuth(createProjectHandler));