import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
const dbName = process.env.MONGODB_DB_NAME ?? "dementia-aware";

let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return cachedClient;
}

export async function getMedicalCollection() {
  const client = await getMongoClient();
  return client.db(dbName).collection("medical_records");
}

export async function closeMongoClient() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
  }
}

export { dbName };
