import process from "node:process";
import "dotenv/config";
import { MongoClient } from "mongodb";

const promoteAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "pizzahub";
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!mongoUri || !adminEmail) {
    throw new Error(
      "MONGODB_URI or ADMIN_EMAIL is missing from .env"
    );
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const users = db.collection("user");

    const adminUser = await users.findOne({
      email: adminEmail,
    });

    if (!adminUser) {
      throw new Error(
        "Admin account not found. Please register this email first."
      );
    }

    if (adminUser.isBlocked === true) {
      throw new Error(
        "This account is blocked. Unblock it before promotion."
      );
    }

    const result = await users.updateOne(
      {
        _id: adminUser._id,
        email: adminEmail,
      },
      {
        $set: {
          role: "admin",
          isBlocked: false,
        },
      }
    );

    if (result.modifiedCount !== 1) {
      throw new Error(
        "Admin promotion was not completed."
      );
    }

    console.log("Admin role assigned successfully!");
    console.log(`Admin email: ${adminEmail}`);
  } finally {
    await client.close();
  }
};

promoteAdmin().catch((error: unknown) => {
  console.error("Admin promotion failed:", error);
  process.exitCode = 1;
});