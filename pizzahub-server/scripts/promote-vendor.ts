import process from "node:process";
import "dotenv/config";
import { MongoClient } from "mongodb";

const promoteVendor = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "pizzahub";
  const vendorEmail = process.env.VENDOR_EMAIL?.trim().toLowerCase();

  if (!mongoUri || !vendorEmail) {
    throw new Error(
      "MONGODB_URI or VENDOR_EMAIL is missing from .env"
    );
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const users = db.collection("user");

    const vendorUser = await users.findOne({
      email: vendorEmail,
    });

    if (!vendorUser) {
      throw new Error(
        "Vendor account not found. Register this email first."
      );
    }

    if (vendorUser.isBlocked === true) {
      throw new Error("This account is blocked.");
    }

    const result = await users.updateOne(
      {
        _id: vendorUser._id,
        email: vendorEmail,
      },
      {
        $set: {
          role: "vendor",
          subscriptionPlan: "free",
        },
      }
    );

    if (result.modifiedCount !== 1) {
      throw new Error("Vendor promotion was not completed.");
    }

    console.log("Vendor role assigned successfully!");
    console.log(`Vendor email: ${vendorEmail}`);
  } finally {
    await client.close();
  }
};

promoteVendor().catch((error: unknown) => {
  console.error("Vendor promotion failed:", error);
  process.exitCode = 1;
});