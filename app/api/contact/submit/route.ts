import { NextRequest, NextResponse } from 'next/server';
import { ContactSettings } from '../../../../lib/models/ContactSettings';
import { sendEnquiryEmail } from '../../../../lib/email';
import { withDatabase, withCors } from '../../../../lib/middleware';

async function submitContactFormHandler(req: NextRequest) {
  try {
    const { name, email, project, budget } = await req.json();

    if (!name || !email || !project) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and project are required' },
        { status: 400 }
      );
    }

    console.log('Contact form submission received:', { name, email, hasProject: !!project });

    // Get enquiry email from settings
    const settings = await ContactSettings.findOne();
    
    if (!settings || !settings.enquiryEmail) {
      console.error('No enquiry email configured in contact settings');
      return NextResponse.json({
        success: false,
        error: 'Email service not configured. Please contact the administrator.'
      }, { status: 500 });
    }

    console.log('Contact settings found:', {
      enquiryEmail: settings.enquiryEmail,
      hasGmailUser: !!settings.gmailUser,
      hasGmailPassword: !!settings.gmailPassword,
      gmailPasswordLength: settings.gmailPassword?.length || 0
    });

    // Send email
    try {
      const result = await sendEnquiryEmail(settings.enquiryEmail, {
        name,
        email,
        project,
        budget
      });

      console.log('Email sent successfully:', result);
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully!'
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json({
        success: false,
        error: 'Failed to send email. Please try again or contact us directly.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export const POST = withCors(withDatabase(submitContactFormHandler));