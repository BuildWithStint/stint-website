import { NextRequest, NextResponse } from 'next/server';
import { ContactSettings } from '../../../lib/models/ContactSettings';
import { withAuth, withDatabase, withCors, AuthenticatedRequest } from '../../../lib/middleware';

async function getContactSettingsHandler(req: NextRequest) {
  try {
    // Get the latest contact settings (there should only be one document)
    let settings = await ContactSettings.findOne().sort({ updatedAt: -1 });
    
    // If no settings exist, return default empty values
    if (!settings) {
      return NextResponse.json({
        success: true,
        settings: {
          email: '',
          enquiryEmail: '',
          address: '',
          instagram: '',
          twitter: '',
          linkedin: '',
          gmailUser: '',
          gmailPassword: ''
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get contact settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateContactSettingsHandler(req: AuthenticatedRequest) {
  try {
    const { email, enquiryEmail, address, instagram, twitter, linkedin, gmailUser, gmailPassword } = await req.json();

    if (!email || !enquiryEmail || !address) {
      return NextResponse.json(
        { success: false, error: 'Email, enquiry email, and address are required' },
        { status: 400 }
      );
    }

    // Find existing settings or create new one
    let settings = await ContactSettings.findOne();

    if (settings) {
      // Update existing settings
      settings.email = email;
      settings.enquiryEmail = enquiryEmail;
      settings.address = address;
      settings.instagram = instagram || '';
      settings.twitter = twitter || '';
      settings.linkedin = linkedin || '';
      settings.gmailUser = gmailUser || '';
      settings.gmailPassword = gmailPassword || '';
      settings.updatedBy = req.user?.id as any;
      
      await settings.save();
    } else {
      // Create new settings
      settings = new ContactSettings({
        email,
        enquiryEmail,
        address,
        instagram: instagram || '',
        twitter: twitter || '',
        linkedin: linkedin || '',
        gmailUser: gmailUser || '',
        gmailPassword: gmailPassword || '',
        updatedBy: req.user?.id as any
      });
      
      await settings.save();
    }

    await settings.populate('updatedBy', 'email');

    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Update contact settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withCors(withDatabase(getContactSettingsHandler));
export const PUT = withCors(withAuth(updateContactSettingsHandler));