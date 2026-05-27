import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ContactSettings } from '../models/ContactSettings';
import { sendEnquiryEmail } from '../utils/email';

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input', details: errors.array() });
    }

    const { name, email, project, budget } = req.body;
    console.log('Contact form submission received:', { name, email, hasProject: !!project });

    // Get enquiry email from settings
    const settings = await ContactSettings.findOne();
    
    if (!settings || !settings.enquiryEmail) {
      console.error('No enquiry email configured in contact settings');
      return res.status(500).json({
        success: false,
        error: 'Email service not configured. Please contact the administrator.'
      });
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
      res.json({
        success: true,
        message: 'Your message has been sent successfully!'
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again or contact us directly.'
      });
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};
