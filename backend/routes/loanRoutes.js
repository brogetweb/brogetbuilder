
import express from "express";

const router = express.Router();

const BANK_RATES_API =
  "https://quantumemi.com/api/bank-rates?type=home";

// GET /api/loans/banks
router.get("/banks", async (req, res) => {
  try {
    const response = await fetch(BANK_RATES_API);

    if (!response.ok) {
      return res.status(502).json({
        message: "The external lender-rate service is unavailable."
      });
    }

    const data = await response.json();

    const banks = Array.isArray(data.banks)
      ? data.banks
      : [];

    const lenders = banks
      .filter(
        (bank) =>
          bank.slug &&
          bank.bank &&
          Number.isFinite(Number(bank.roi_min)) &&
          Number.isFinite(Number(bank.roi_max))
      )
      .map((bank) => ({
        id: bank.slug,
        name: bank.bank,
        minRate: Number(bank.roi_min),
        maxRate: Number(bank.roi_max),
        // Only pass through tenure if the API actually supplies it.
        maxTenure:
          Number(
            bank.max_tenure ??
            bank.maxTenure ??
            bank.tenure_max
          ) || null
      }));

    res.set("Cache-Control", "public, max-age=3600");

    res.json({
      asOf: data.as_of || null,
      count: lenders.length,
      lenders
    });
  } catch (error) {
    console.error("Loan lender API error:", error.message);

    res.status(500).json({
      message: "Could not fetch lender rates. Please try again later."
    });
  }
});

export default router;