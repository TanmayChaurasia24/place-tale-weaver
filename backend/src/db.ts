import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongourl = process.env.MONGO_URL;

if (!mongourl) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

const connectdb = async (): Promise<void> => {
  try {
    console.log("inside db.ts....");
    
    await mongoose.connect(mongourl);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); 
  }
};

export default connectdb;