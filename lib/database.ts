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
    
    // Check if default admin exists
    const defaultAdmin = await User.findOne({ email: 'admin@stint.com' });
    
    if (!defaultAdmin) {
      // Create new default admin
      const newDefaultAdmin = new User({
        email: 'admin@stint.com',
        password: 'admin123', // This will be hashed by the pre-save middleware
        role: 'admin',
        isSuperUser: true // Mark default admin as super user
      });
      
      await newDefaultAdmin.save();
      console.log('✅ Default super admin user created: admin@stint.com');
    } else {
      // Update existing default admin to ensure it has isSuperUser: true
      const updateResult = await User.updateOne(
        { email: 'admin@stint.com' },
        { $set: { isSuperUser: true } }
      );
      console.log('✅ Default admin updated with super user privileges:', updateResult);
    }

    // Also ensure all other users have isSuperUser field (default to false)
    await User.updateMany(
      { 
        email: { $ne: 'admin@stint.com' },
        isSuperUser: { $exists: false }
      },
      { $set: { isSuperUser: false } }
    );
    
  } catch (error) {
    console.error('❌ Error initializing default admin:', error);
  }
};