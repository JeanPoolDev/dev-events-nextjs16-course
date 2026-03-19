import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGO_URL;


if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env"
  );
}

/**
 * Cached connection shape stored on the global object.
 * Keeping `conn` and `promise` separate lets us return an
 * already-resolved connection immediately on subsequent calls
 * without re-awaiting the same promise.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Extend the Node.js global type so TypeScript knows about
 * our custom cache property without casting to `any`.
 */
declare global {

  var mongoose: MongooseCache | undefined;
}

/**
 * Use the existing global cache in development to survive
 * hot-module replacement, which would otherwise create a new
 * connection on every file change. In production the module is
 * only evaluated once, so the local variable is sufficient.
 */
const cached: MongooseCache = globalThis.mongoose ?? { conn: null, promise: null };

if (process.env.NODE_ENV !== "production") {
  globalThis.mongoose = cached;
}

/**
 * Returns an active Mongoose connection, reusing a cached one
 * when available. Safe to call from multiple concurrent requests
 * because it stores a single in-flight promise until resolved.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection if we already have one.
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection attempt is in progress, start one.
  if (!cached.promise) {

    if (!MONGODB_URI) {
      throw new Error(
        'Porfavor define el MONGODOB_URI environment varible inside .env.local'
      );
    }


    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Fail fast rather than queuing ops while disconnected.
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  // Await the in-flight promise (whether we just created it or not).
  cached.conn = await cached.promise;
  return cached.conn;
}
