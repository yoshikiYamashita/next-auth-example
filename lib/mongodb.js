import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI;
// const MONGODB_DB = process.env.MONGODB_DB
const DB_POSTED_DATA = process.env.DB_POSTED_DATA;
const DB_AUTH = process.env.DB_AUTH;
const DB_CUTOM_USER_DATA = process.env.DB_CUTOM_USER_DATA;


if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// if (!MONGODB_DB) {
//   throw new Error(
//     'Please define the MONGODB_DB environment variable inside .env.local'
//   )
// }

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {

    cached.promise = MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    }).then((client) => {
      return {
        client,
        db_auth: client.db(DB_AUTH),
        db_posted_data: client.db(DB_POSTED_DATA),
        db_custom_user_data: client.db(DB_CUTOM_USER_DATA),
        // ur additional_db_name: client.db("YOUR_ADDITIONAL_DB_NAME"),
      }
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
