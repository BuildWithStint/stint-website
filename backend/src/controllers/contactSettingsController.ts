import { Response } from 'express';
import { validationResult } from 'express-validator';
import { ContactSettings } from '../models/ContactSettings';
import { AuthRequest } from '../middleware/auth';

export const getContactSettings = async (req: AuthRequest, res: Response) => {
  try {
    // Get the latest contact settings (there should only be one document)
    let settings = await ContactSettings.findOne().sort({ updatedAt: -1 });
    
    // If no settings exist, return default empty values
    if (!settings) {
      return res.json({
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
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get contact settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateContactSettings = async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input', details: errors.array() });
    }

    const { email, enquiryEmail, address, instagram, twitter, linkedin, gmailUser, gmailPassword } = req.body;

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
      settings.updatedBy = req.user?.userId as any;
      
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
        updatedBy: req.user?.userId as any
      });
      
      await settings.save();
    }

    await settings.populate('updatedBy', 'email');

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Update contact settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
