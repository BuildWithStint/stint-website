import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  initials: string;
  role: string;
  bio: string;
  tools: string[];
  accent: string;
  index: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  initials: {
    type: String,
    required: true,
    maxlength: 2,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  tools: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length > 0,
      message: 'At least one tool is required'
    }
  },
  accent: {
    type: String,
    required: true,
    match: /^#[0-9A-Fa-f]{6}$/
  },
  index: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
