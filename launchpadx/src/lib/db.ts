import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  (process.env.NODE_ENV === 'production' ? undefined : 'mongodb://localhost:27017/launchpadx');

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const mongoUri = MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const cached = global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(mongoUri, opts);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
