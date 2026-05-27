import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  label: string;
  image: string;
  deploymentLink: string;
  accent: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  label: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  image: {
    type: String,
    required: true
  },
  deploymentLink: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  accent: {
    type: String,
    required: true,
    match: [/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);