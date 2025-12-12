// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in .env");

declare global {
  // for hot-reloading in dev
  // eslint-disable-next-line @typescript-eslint/no-namespace
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached!.conn) return cached!.conn;
  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      // Mongoose 7+ doesn't require useNewUrlParser/useUnifiedTopology, but harmless
    };
    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => m);
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
