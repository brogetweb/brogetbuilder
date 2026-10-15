import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    family: 4,
  });

  console.log("MongoDB connected successfully");
};

export default connectDB;