import mongoose from "mongoose";

const websiteVisitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    firstSource: {
      type: String,
      default: "Direct",
    },

    lastSource: {
      type: String,
      default: "Direct",
    },

    city: {
      type: String,
      default: "Unknown",
    },

    region: {
      type: String,
      default: "Unknown",
    },

    country: {
      type: String,
      default: "Unknown",
    },

    countryCode: String,

    device: {
      type: String,
      default: "Unknown",
    },

    browser: {
      type: String,
      default: "Unknown",
    },

    totalPageViews: {
      type: Number,
      default: 0,
    },

    totalSessions: {
      type: Number,
      default: 0,
    },

    lastSessionIsReturning: {
      type: Boolean,
      default: false,
    },

    firstSeen: {
      type: Date,
      default: Date.now,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    lastSessionId: String,
  },
  {
    timestamps: true,
  }
);

const WebsiteVisitor = mongoose.model(
  "WebsiteVisitor",
  websiteVisitorSchema
);

export default WebsiteVisitor;