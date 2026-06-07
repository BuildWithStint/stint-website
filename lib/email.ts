import nodemailer from 'nodemailer';
import { ContactSettings } from './models/ContactSettings';

// Create reusable transporter
const createTransporter = async () => {
  console.log('=== EMAIL TRANSPORTER DEBUG ===');
  
  // Get Gmail credentials from database
  try {
    const settings = await ContactSettings.findOne();
    console.log('Database query result:', {
      settingsFound: !!settings,
      hasGmailUser: !!settings?.gmailUser,
      hasGmailPassword: !!settings?.gmailPassword,
      gmailUser: settings?.gmailUser || 'NOT_SET',
      passwordLength: settings?.gmailPassword?.length || 0
    });
    
    if (settings?.gmailUser && settings?.gmailPassword) {
      console.log('Using Gmail credentials from database:', {
        gmailUser: settings.gmailUser,
        passwordLength: settings.gmailPassword.length,
        passwordPreview: settings.gmailPassword.substring(0, 4) + '...' + settings.gmailPassword.slice(-4)
      });
      
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.zoho.in', // Change to smtp.zoho.com or smtp.zoho.eu based on your region
          port: 465, // Zoho uses 465 for SSL or 587 for TLS
          secure: true,
          auth: {
            user: settings.gmailUser.trim(),
            pass: settings.gmailPassword.trim()
          }
        });
        
        // Test the connection
        console.log('Testing Zoho connection...');
        await transporter.verify();
        console.log('Zoho connection verified successfully');
        return transporter;
      } catch (error) {
        console.error('Zoho connection failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Zoho authentication failed: ${errorMessage}`);
      }
    }
  } catch (dbError) {
    console.error('Database error when fetching settings:', dbError);
  }
  
  // Fallback to env variables if available
  console.log('Checking environment variables...');
  if (process.env.EMAIL_SERVICE === 'zoho' && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    if (!process.env.EMAIL_USER.includes('your-') && !process.env.EMAIL_PASSWORD.includes('your-')) {
      console.log('Using Zoho credentials from environment variables');
      return nodemailer.createTransport({
        host: 'smtp.zoho.in', // Change to smtp.zoho.com or smtp.zoho.eu based on your region
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
  }
  
  // Default to Ethereal (test email service) for development
  console.log('No Gmail credentials configured. Using Ethereal test service.');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal.pass'
    }
  });
};

export const sendEnquiryEmail = async (
  to: string,
  enquiryData: {
    name: string;
    email: string;
    project: string;
    budget?: string;
  }
) => {
  try {
    console.log(`Attempting to send enquiry email to: ${to}`);
    const transporter = await createTransporter();
    
    // Determine the exact sender email configured to avoid 553 relay error from Zoho
    const settings = await ContactSettings.findOne();
    let senderEmail = process.env.EMAIL_FROM || 'noreply@stintcollective.co';
    if (settings?.gmailUser && settings?.gmailPassword) {
      senderEmail = settings.gmailUser;
    } else if (process.env.EMAIL_SERVICE === 'zoho' && process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('your-')) {
      senderEmail = process.env.EMAIL_USER;
    }

    const mailOptions = {
      from: senderEmail,
      to,
      subject: `New Project Enquiry from ${enquiryData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C8973D;">New Project Enquiry</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${enquiryData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${enquiryData.email}">${enquiryData.email}</a></p>
            ${enquiryData.budget ? `<p><strong>Budget:</strong> ${enquiryData.budget}</p>` : ''}
          </div>
          
          <div style="margin: 20px 0;">
            <h3>Project Details:</h3>
            <p style="white-space: pre-wrap;">${enquiryData.project}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px;">
            This email was sent from your website contact form.
          </p>
        </div>
      `,
      text: `
New Project Enquiry

Name: ${enquiryData.name}
Email: ${enquiryData.email}
${enquiryData.budget ? `Budget: ${enquiryData.budget}` : ''}

Project Details:
${enquiryData.project}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    // Check if using real SMTP or test service
    const usingRealSMTP = (settings?.gmailUser && settings?.gmailPassword) || 
                          (process.env.EMAIL_SERVICE === 'zoho' && process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('your-'));
    
    if (!usingRealSMTP) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL (Ethereal test email):', previewUrl);
      console.log('Note: This is a test email. To send real emails, configure SMTP credentials in admin panel.');
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};
