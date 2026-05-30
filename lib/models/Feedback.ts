import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  email: string;
  rating: number;
  review: string;
  company?: string;
  position?: string;
  isVisible: boolean;
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  position: {
    type: String,
    trim: true,
    maxlength: 100
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

export const Feedback = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', feedbackSchema);
