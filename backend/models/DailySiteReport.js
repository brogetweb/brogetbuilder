import mongoose from "mongoose";

const dailySiteReportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reportDate: {
      type: String,
      required: true,
    },

    workSummary: {
      type: String,
      required: true,
      trim: true,
    },

    workersPresent: {
      type: Number,
      default: 0,
      min: 0,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },

    activities: [
      {
        activityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SiteActivity",
          required: true,
        },

        completedQuantity: {
          type: Number,
          required: true,
          min: 0,
        },

        progress: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
      },
    ],

    materials: [
      {
        materialId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SiteMaterial",
          required: true,
        },

        quantityUsed: {
          type: Number,
          required: true,
          min: 0.001,
        },
      },
    ],

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    submissionStatus: {
      type: String,
      enum: ["On Time", "Late"],
      required: true,
    },
  },
  { timestamps: true }
);

dailySiteReportSchema.index(
  { projectId: 1, supervisorId: 1, reportDate: 1 },
  { unique: true }
);

export default mongoose.model(
  "DailySiteReport",
  dailySiteReportSchema
);