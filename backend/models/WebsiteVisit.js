import mongoose from "mongoose";

const websiteVisitSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
    },

    page: {
      type: String,
      default: "/",
    },

    source: {
      type: String,
      default: "Direct",
    },

    referrer: {
      type: String,
      default: "",
    },

    campaign: String,

    device: String,

    browser: String,

    city: String,

    region: String,

    country: String,

    isReturning: {
      type: Boolean,
      default: false,
    },

    visitedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const WebsiteVisit = mongoose.model(
  "WebsiteVisit",
  websiteVisitSchema
);

export default WebsiteVisit;