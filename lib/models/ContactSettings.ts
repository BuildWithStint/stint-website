import mongoose, { Document, Schema } from 'mongoose';

export interface IContactSettings extends Document {
  email: string;
  enquiryEmail: string;
  address: string;
  phoneNumbers: string[];
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  // Gmail credentials for sending emails
  gmailUser?: string;
  gmailPassword?: string;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactSettingsSchema = new Schema<IContactSettings>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  enquiryEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  phoneNumbers: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        // Basic phone number validation - allows various formats
        return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Please enter a valid phone number'
    }
  }],
  instagram: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  twitter: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  gmailUser: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@gmail\.com$/, 'Please enter a valid Gmail address']
  },
  gmailPassword: {
    type: String,
    trim: true,
    minlength: 16,
    maxlength: 16
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const ContactSettings = mongoose.models.ContactSettings || mongoose.model<IContactSettings>('ContactSettings', contactSettingsSchema);
