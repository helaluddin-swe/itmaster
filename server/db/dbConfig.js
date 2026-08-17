const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    process.exit(1);
  }

  try {
    // Recommended for Mongoose 7+
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(uri, {
      // Optional but useful options
      // serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.name}`);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB');
    console.error('Error Details:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;