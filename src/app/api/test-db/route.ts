import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  console.log('🧪 TEST API: Testing MongoDB connection');
  
  try {
    console.log('🔗 TEST: Connecting to MongoDB...');
    await connectDB();
    
    console.log('✅ TEST: MongoDB connected successfully');
    
    // Safe way to check if database is available
    if (!mongoose.connection.db) {
      throw new Error('Database connection established but database object is undefined');
    }
    
    // Now we can safely use db since we checked it's not undefined
    const db = mongoose.connection.db;
    
    // Test database operations
    console.log('📊 TEST: Database name:', db.databaseName);
    const collections = await db.listCollections().toArray();
    
    console.log('📊 TEST: Database collections:', collections.map(c => c.name));
    
    // Test a simple operation to verify database is working
    const adminDb = db.admin();
    const serverInfo = await adminDb.serverInfo();
    
    console.log('✅ TEST: Database operations successful');
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: {
        name: db.databaseName,
        collections: collections.map(c => c.name)
      },
      server: {
        version: serverInfo.version,
        host: mongoose.connection.host
      },
      connectionState: mongoose.connection.readyState,
      connectionStateName: getConnectionStateName(mongoose.connection.readyState)
    });
    
  } catch (error: any) {
    console.error('❌ TEST: MongoDB connection failed:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    return NextResponse.json({
      success: false,
      error: error.message,
      connectionState: mongoose.connection?.readyState || 'disconnected',
      connectionStateName: getConnectionStateName(mongoose.connection?.readyState)
    }, { status: 500 });
  }
}

// Helper function to convert connection state number to name
function getConnectionStateName(state: number | undefined): string {
  if (state === undefined) return 'unknown';
  
  switch (state) {
    case 0: return 'disconnected';
    case 1: return 'connected';
    case 2: return 'connecting';
    case 3: return 'disconnecting';
    default: return 'unknown';
  }
}