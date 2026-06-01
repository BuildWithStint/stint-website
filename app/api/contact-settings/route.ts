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
          phoneNumbers: [],
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
      settings: {
        ...settings.toObject(),
        phoneNumbers: settings.phoneNumbers || []
      }
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
    const { email, enquiryEmail, address, phoneNumbers, instagram, twitter, linkedin, gmailUser, gmailPassword } = await req.json();

    if (!email || !enquiryEmail || !address) {
      return NextResponse.json(
        { success: false, error: 'Email, enquiry email, and address are required' },
        { status: 400 }
      );
    }

    // Validate phone numbers if provided
    if (phoneNumbers && Array.isArray(phoneNumbers)) {
      for (const phone of phoneNumbers) {
        if (phone && typeof phone === 'string') {
          const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
          if (!/^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone)) {
            return NextResponse.json(
              { success: false, error: `Invalid phone number format: ${phone}` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Use raw MongoDB operations to ensure the field is saved
    const db = (ContactSettings as any).db;
    const collection = db.collection('contactsettings');
    
    // Delete existing document and create new one
    await collection.deleteMany({});
    
    const newDoc = {
      email,
      enquiryEmail,
      address,
      phoneNumbers: phoneNumbers || [],
      instagram: instagram || '',
      twitter: twitter || '',
      linkedin: linkedin || '',
      gmailUser: gmailUser || '',
      gmailPassword: gmailPassword || '',
      updatedBy: req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newDoc);
    console.log('Insert result:', result);
    
    // Fetch the created document
    const settings = await ContactSettings.findById(result.insertedId).populate('updatedBy', 'email');
    console.log('Created settings:', settings?.toObject());

    return NextResponse.json({
      success: true,
      settings: settings?.toObject()
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