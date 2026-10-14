
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

async function createSuperAdmin() {
  try {
    const { MONGO_URI, SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } =
      process.env;

    if (
      !MONGO_URI ||
      !SUPERADMIN_NAME ||
      !SUPERADMIN_EMAIL ||
      !SUPERADMIN_PASSWORD
    ) {
      throw new Error(
        "Please set MONGO_URI, SUPERADMIN_NAME, SUPERADMIN_EMAIL, and SUPERADMIN_PASSWORD in your .env file."
      );
    }

    if (SUPERADMIN_PASSWORD.length < 12) {
      throw new Error(
        "Use a Super Admin password with at least 12 characters."
      );
    }

    await mongoose.connect(MONGO_URI);

    const email = SUPERADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "This email already exists. Use a different email; this script will not promote an existing account."
      );
    }

    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 12);

    const superAdmin = await User.create({
      name: SUPERADMIN_NAME.trim(),
      email,
      password: hashedPassword,
      role: "superadmin",
      approvalStatus: "not_required",
    });

    console.log("Super Admin created successfully!");
    console.log("Email:", superAdmin.email);
    console.log("Role:", superAdmin.role);
    console.log("You can now log in using the Super Admin role.");
  } catch (error) {
    console.error("Could not create Super Admin:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

createSuperAdmin();