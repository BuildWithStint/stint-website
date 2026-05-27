import mongoose from 'mongoose';
import { User } from '../models/User';

export const connectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Attempting to connect to MongoDB...');
    console.log('URI starts with:', uri?.substring(0, 20));
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    
    // Initialize default admin user if no users exist
    await initializeDefaultAdmin();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const initializeDefaultAdmin = async () => {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      const defaultAdmin = new User({
        email: 'admin@stint.com',
        password: 'admin123', // This will be hashed by the pre-save middleware
        role: 'admin'
      });
      
      await defaultAdmin.save();
      console.log('✅ Default admin user created: admin@stint.com');
    }
  } catch (error) {
    console.error('❌ Error initializing default admin:', error);
  }
};