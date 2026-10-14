// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true
//     },

//     password: {
//       type: String,
//       required: true
//     },

//     role: {
//       type: String,
//       enum: ["user", "owner"],
//       default: "user"
//     },

//     favourites: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Property"
//       }
//     ]
//   },
//   {
//     timestamps: true
//   }
// );

// const User = mongoose.model(
//   "User",
//   userSchema
// );

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // User account role
    role: {
      type: String,
      enum: ["user", "owner", "superadmin"],
      default: "user",
    },

    // Owner application approval status
    approvalStatus: {
      type: String,
      enum: ["not_required", "pending", "approved", "rejected"],
      default: "not_required",
    },

    // Reason provided when the Super Admin rejects an application
    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },

    // Super Admin who reviewed the application
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Date and time when the application was reviewed
    reviewedAt: {
      type: Date,
      default: null,
    },

    // Existing favourites functionality
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;