const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

// Connect to the database
const connectDB = async () => {
  try {
    if (process.env.USE_MEMORY_DB === 'true') {
      // Use MongoDB Memory Server for local development
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      console.log('Using MongoDB Memory Server:', uri);
      await mongoose.connect(uri);
      console.log('MongoDB Memory Server Connected');
      return true;
    } else {
      // Use regular MongoDB connection
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/issue-tracker';
      console.log('Attempting to connect to MongoDB...');
      const conn = await mongoose.connect(mongoURI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Running without database connection for testing...');
    return false;
  }
};

// Disconnect from the database
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

// Check if database is connected
const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

module.exports = { connectDB, disconnectDB, isDbConnected };