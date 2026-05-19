import mongoose from "mongoose";
import env from "../config/env.js";

const MONGO_URI = env.database_url;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export const connectMongoDb = async () => {

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {

    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });

  }

  cached.conn = await cached.promise;

  return cached.conn;
};
