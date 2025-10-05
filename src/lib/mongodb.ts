import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

console.log('🔧 MongoDB: Environment check:', {
  nodeEnv: process.env.NODE_ENV,
  hasMongoURI: !!MONGODB_URI,
  mongoURILength: MONGODB_URI?.length,
  mongoURIStart: MONGODB_URI?.substring(0, 60) + '...'
});

if (!MONGODB_URI) {
  console.error('❌ MongoDB: MONGODB_URI is not defined');
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  console.log('🔗 MongoDB: connectDB function called');
  
  if (cached.conn) {
    console.log('✅ MongoDB: Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔄 MongoDB: Creating new connection promise');
    
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 30000, // 30 seconds
      family: 4, // Use IPv4, skip IPv6
      retryWrites: true,
      w: 'majority'
    };

    console.log('⚙️ MongoDB: Connection options:', opts);

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('✅ MongoDB: Connected successfully to database');
        console.log('📊 MongoDB: Connection state:', mongooseInstance.connection.readyState);
        console.log('🏷️ MongoDB: Database name:', mongooseInstance.connection.db?.databaseName);
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('❌ MongoDB: Connection failed:', {
          name: error.name,
          message: error.message,
          code: error.code
        });
        cached.promise = null;
        throw error;
      });
  }

  try {
    console.log('⏳ MongoDB: Waiting for connection (timeout: 30s)...');
    cached.conn = await cached.promise;
    console.log('✅ MongoDB: Connection established successfully');
    return cached.conn;
  } catch (e: any) {
    console.error('❌ MongoDB: Connection error details:', {
      name: e.name,
      message: e.message,
      code: e.code
    });
    cached.promise = null;
    throw e;
  }
}

export default connectDB;