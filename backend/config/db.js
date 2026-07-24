import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodServer = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn('⚠️  MONGODB_URI environment variable is missing.');
  } else if (mongoURI.includes('<username>') || mongoURI.includes('<password>')) {
    console.warn('⚠️  MONGODB_URI contains unconfigured placeholder values (<username>/<password>).');
  }

  // Attempt connection with provided URI if valid
  if (mongoURI && !mongoURI.includes('<username>') && !mongoURI.includes('<password>')) {
    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`❌ Failed to connect to primary MongoDB URI: ${error.message}`);
    }
  }

  // Resilient fallback to MongoMemoryServer
  try {
    console.log('⚡ Initializing in-memory MongoDB database...');
    mongodServer = await MongoMemoryServer.create();
    const memoryUri = mongodServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✓ MongoDB Connected: ${conn.connection.host} (In-Memory Database)`);
    return conn;
  } catch (err) {
    console.error(`❌ Fatal Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;

