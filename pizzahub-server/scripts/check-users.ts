import process from "node:process";
import "dotenv/config";
import { MongoClient } from "mongodb";

const checkUsers = async () => {
  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME || "pizzahub");

    const collections = await db.listCollections().toArray();

    console.log("Database:", db.databaseName);
    console.log(
      "Collections:",
      collections.map((collection) => collection.name)
    );

    for (const collection of collections) {
      const count = await db
        .collection(collection.name)
        .countDocuments();

      console.log(`${collection.name}: ${count} documents`);
    }
  } finally {
    await client.close();
  }
};

checkUsers().catch(console.error);