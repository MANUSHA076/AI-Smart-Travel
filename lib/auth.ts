import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection.db;
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    return mongoose.connection.db;
};

const db = await connectDB();

if (!db) {
    throw new Error("MongoDB connection is not ready");
}

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {  
        enabled: true 
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
            }
        }
    }
});