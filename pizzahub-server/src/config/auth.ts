
import "dotenv/config";

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "pizzahub";

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is missing in environment variables");
}

if (process.env.BETTER_AUTH_SECRET.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
}

const client = new MongoClient(mongoUri);
const db = client.db(dbName);

export const auth = betterAuth({
  appName: "PizzaHub",

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
  ],

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },

      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },

      businessName: {
        type: "string",
        required: false,
        input: true,
      },

      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },

      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
});
