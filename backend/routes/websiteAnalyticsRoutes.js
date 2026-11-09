
import express from "express";

import WebsiteVisitor from "../models/WebsiteVisitor.js";
import WebsiteVisit from "../models/WebsiteVisit.js";

const router = express.Router();

// ----------------------------------
// DETECT APPROXIMATE LOCATION
// ----------------------------------

const getVisitorLocation = async (ip) => {
  try {
    if (
      !ip ||
      ip === "::1" ||
      ip === "127.0.0.1" ||
      ip.startsWith("10.") ||
      ip.startsWith("192.168.") ||
      ip.startsWith("::ffff:127.")
    ) {
      return {};
    }

    const response = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/json/`
    );

    if (!response.ok) return {};

    const data = await response.json();

    if (data.error) return {};

    return {
      city: data.city || "Unknown",
      region: data.region || "Unknown",
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "",
    };

  } catch (error) {
    console.error("Location lookup failed:", error.message);
    return {};
  }
};

// ----------------------------------
// TRACK WEBSITE VISIT
// ----------------------------------

router.post("/track", async (req, res) => {
  try {
    const {
      visitorId,
      sessionId,
      page,
      source,
      referrer,
      campaign,
      device,
      browser,
    } = req.body;

    if (
      !visitorId ||
      !sessionId ||
      typeof visitorId !== "string" ||
      typeof sessionId !== "string" ||
      visitorId.length > 100 ||
      sessionId.length > 100
    ) {
      return res.status(400).json({
        message: "Invalid visitor or session ID",
      });
    }

    const allowedSources = [
      "Google",
      "Instagram",
      "Facebook",
      "YouTube",
      "Other",
      "Direct",
    ];

    const trafficSource = allowedSources.includes(source)
      ? source
      : "Other";

    const ip = req.ip;

    let visitor = await WebsiteVisitor.findOne({
      visitorId,
    });

    const isNewVisitor = !visitor;

    // ----------------------------------
    // CREATE NEW VISITOR
    // ----------------------------------

    if (!visitor) {
      const location = await getVisitorLocation(ip);

      try {
        visitor = await WebsiteVisitor.create({
          visitorId,

          firstSource: trafficSource,
          lastSource: trafficSource,

          city: location.city || "Unknown",
          region: location.region || "Unknown",
          country: location.country || "Unknown",
          countryCode: location.countryCode || "",

          device: device || "Unknown",
          browser: browser || "Unknown",

          totalPageViews: 0,
          totalSessions: 0,
        });

      } catch (error) {
        if (error.code !== 11000) throw error;

        visitor = await WebsiteVisitor.findOne({
          visitorId,
        });
      }
    }

    if (!visitor) {
      throw new Error("Unable to identify visitor");
    }

    // ----------------------------------
    // SESSION TRACKING
    // ----------------------------------

    const isNewSession =
      visitor.lastSessionId !== sessionId;

    if (isNewSession) {
      visitor.lastSessionIsReturning =
        visitor.totalSessions > 0;

      visitor.totalSessions += 1;
      visitor.lastSessionId = sessionId;
    }

    visitor.totalPageViews += 1;
    visitor.lastSeen = new Date();
    visitor.lastSource = trafficSource;

    if (device) visitor.device = device;
    if (browser) visitor.browser = browser;

    await visitor.save();

    // ----------------------------------
    // SAVE INDIVIDUAL PAGE VISIT
    // ----------------------------------

    const visit = await WebsiteVisit.create({
      visitorId,
      sessionId,

      page: page || "/",

      source: trafficSource,

      referrer: referrer || "",
      campaign: campaign || "",

      device: device || "Unknown",
      browser: browser || "Unknown",

      city: visitor.city,
      region: visitor.region,
      country: visitor.country,

      isReturning: visitor.lastSessionIsReturning,

      visitedAt: new Date(),
    });

    res.status(201).json({
      success: true,

      message: "Website visit recorded",

      visitorType: isNewVisitor
        ? "New Visitor"
        : "Returning Visitor",

      isNewSession,

      visitId: visit._id,
    });

  } catch (error) {
    console.error("Website tracking error:", error);

    res.status(500).json({
      message: "Unable to record website visit",
    });
  }
});

// ----------------------------------
// ADMIN ANALYTICS DASHBOARD
// ----------------------------------

router.get("/dashboard", async (req, res) => {
  try {
    const [
      totalVisitors,
      totalPageViews,
      returningVisitors,
      newVisitors,
      sourceStats,
      locationStats,
      deviceStats,
      recentVisits,
      dailyStats,
    ] = await Promise.all([

      WebsiteVisitor.countDocuments(),

      WebsiteVisit.countDocuments(),

      WebsiteVisitor.countDocuments({
        totalSessions: { $gt: 1 },
      }),

      WebsiteVisitor.countDocuments({
        totalSessions: { $lte: 1 },
      }),

      // TRAFFIC SOURCES
      WebsiteVisit.aggregate([
        {
          $group: {
            _id: "$source",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // VISITOR LOCATIONS
      WebsiteVisitor.aggregate([
        {
          $group: {
            _id: {
              city: "$city",
              country: "$country",
            },
            visitors: { $sum: 1 },
          },
        },
        { $sort: { visitors: -1 } },
        { $limit: 10 },
      ]),

      // DEVICES
      WebsiteVisitor.aggregate([
        {
          $group: {
            _id: "$device",
            count: { $sum: 1 },
          },
        },
      ]),

      // RECENT VISITS
      WebsiteVisit.find()
        .sort({ visitedAt: -1 })
        .limit(20)
        .select(
          "visitorId page source device browser city region country isReturning visitedAt"
        )
        .lean(),

      // LAST 30 DAYS
      WebsiteVisit.aggregate([
        {
          $match: {
            visitedAt: {
              $gte: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$visitedAt",
                timezone: "Asia/Kolkata",
              },
            },
            visits: { $sum: 1 },
            uniqueVisitors: {
              $addToSet: "$visitorId",
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            visits: 1,
            uniqueVisitors: {
              $size: "$uniqueVisitors",
            },
          },
        },
        { $sort: { date: 1 } },
      ]),
    ]);

    res.json({
      success: true,

      overview: {
        totalVisitors,
        totalPageViews,
        returningVisitors,
        newVisitors,
      },

      sourceStats,
      locationStats,
      deviceStats,
      dailyStats,
      recentVisits,
    });

  } catch (error) {
    console.error("Analytics dashboard error:", error);

    res.status(500).json({
      message: "Unable to load analytics",
    });
  }
});

export default router;
