import mongoose from 'mongoose';

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(uri);
    isConnected = true;
    console.log('✅ Connected to MongoDB');
    
    // Initialize default admin user if no users exist
    await initializeDefaultAdmin();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

const initializeDefaultAdmin = async () => {
  try {
    // Import User model dynamically to avoid circular dependencies
    const { User } = await import('./models/User');
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