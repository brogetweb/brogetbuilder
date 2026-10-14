
import express from "express";
import mongoose from "mongoose";
import Property from "../models/Property.js";

const router = express.Router();

router.post("/property-call", async (req, res) => {
  try {
    const {
      propertyId,
      customerName,
      phone,
      consent
    } = req.body;

    if (!consent) {
      return res.status(400).json({
        message: "Please confirm that you want to receive an AI call."
      });
    }

    if (
      !mongoose.isValidObjectId(propertyId) ||
      !customerName?.trim() ||
      !phone?.trim()
    ) {
      return res.status(400).json({
        message: "Please provide valid property and contact details."
      });
    }

    // Accept international E.164 phone numbers, e.g. +919876543210.
    const normalizedPhone = phone.replace(/[\s()-]/g, "");

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      return res.status(400).json({
        message: "Enter a valid phone number with country code, e.g. +91..."
      });
    }

    if (
      !process.env.VAPI_PRIVATE_KEY ||
      !process.env.VAPI_ASSISTANT_ID ||
      !process.env.VAPI_PHONE_NUMBER_ID
    ) {
      return res.status(500).json({
        message: "AI calling is not configured on the server."
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found."
      });
    }

    const amenities = Array.isArray(property.amenities)
      ? property.amenities.join(", ")
      : property.amenities || "Not specified";

    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        assistantId: process.env.VAPI_ASSISTANT_ID,
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
        customer: {
          number: normalizedPhone,
          name: customerName.trim()
        },
        assistantOverrides: {
          variableValues: {
            customerName: customerName.trim(),
            propertyTitle: String(property.title || "Property"),
            propertyLocation: String(
              property.location || property.city || "Not specified"
            ),
            propertyPrice: String(property.price ?? "Not specified"),
            propertyType: String(
              property.propertyType || "Not specified"
            ),
            bedrooms: String(property.bedrooms ?? "Not specified"),
            bathrooms: String(property.bathrooms ?? "Not specified"),
            propertyArea: String(property.area ?? "Not specified"),
            propertyAmenities: String(amenities)
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Vapi call request failed:", data);

      return res.status(502).json({
        message: "The AI call could not be started. Please try again."
      });
    }

    return res.status(202).json({
      message: "Your AI property call has been requested.",
      callId: data.id || null
    });
  } catch (error) {
    console.error("AI property call error:", error.message);

    return res.status(500).json({
      message: "Unable to request the AI call right now."
    });
  }
});

export default router;