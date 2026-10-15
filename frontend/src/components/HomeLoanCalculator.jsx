
import { useEffect, useState } from "react";
import { API_URL } from "../config";

function HomeLoanCalculator({ propertyPrice = 0 }) {
  const [price, setPrice] = useState(Number(propertyPrice) || 0);
  const [downPayment, setDownPayment] = useState(
    Math.round((Number(propertyPrice) || 0) * 0.2)
  );

  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [existingEmis, setExistingEmis] = useState("");
  const [result, setResult] = useState(null);

  // External lender API state
  const [lenders, setLenders] = useState([]);
  const [selectedLenderId, setSelectedLenderId] = useState("");
  const [lendersLoading, setLendersLoading] = useState(true);
  const [lenderError, setLenderError] = useState("");
  const [ratesAsOf, setRatesAsOf] = useState(null);

  const [messageIndex, setMessageIndex] = useState(0);

  const bannerMessages = [
    {
      title: "Your Dream Home Called...",
      highlight: "Your Salary Wants a Meeting! 😏",
      description:
        "That balcony looks dreamy. Let's find out whether the EMI does too.",
      button: "Can I Afford This?"
    },
    {
      title: "Love at First Sight?",
      highlight: "Let's Talk Monthly Commitment! 💸",
      description:
        "Falling for a home is easy. Planning the payments is the smart part.",
      button: "Calculate My EMI"
    },
    {
      title: "That House Is Giving Luxury...",
      highlight: "Let's Check Your Budget! 🏡",
      description:
        "Before you imagine the housewarming party, meet your future EMI.",
      button: "Meet My EMI"
    },
    {
      title: "Plot Twist!",
      highlight: "The Down Payment Has Entered the Chat! 😂",
      description:
        "Your dream home deserves a plan. Your savings deserve a heads-up.",
      button: "Let's Do the Maths"
    }
  ];

  const currentMessage = bannerMessages[messageIndex];

  const selectedLender = lenders.find(
    (lender) => lender.id === selectedLenderId
  );

  // Keep property price in sync with PropertyDetails.
  useEffect(() => {
    const newPrice = Math.max(0, Number(propertyPrice) || 0);

    setPrice(newPrice);
    setDownPayment(Math.round(newPrice * 0.2));
    setResult(null);
  }, [propertyPrice]);

  // Fetch lender rates through the HomeEstate backend.
  useEffect(() => {
    const controller = new AbortController();

    const fetchLenders = async () => {
      try {
        setLendersLoading(true);
        setLenderError("");

        const response = await fetch(`${API_URL}/loans/banks`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to fetch lender rates.");
        }

        const data = await response.json();

        const availableLenders = Array.isArray(data.lenders)
          ? data.lenders
              .filter(
                (lender) =>
                  lender.id &&
                  lender.name &&
                  Number.isFinite(Number(lender.minRate)) &&
                  Number.isFinite(Number(lender.maxRate)) &&
                  Number(lender.minRate) >= 0 &&
                  Number(lender.maxRate) >= Number(lender.minRate)
              )
              .map((lender) => ({
                ...lender,
                minRate: Number(lender.minRate),
                maxRate: Number(lender.maxRate),
                maxTenure:
                  Number(lender.maxTenure) > 0
                    ? Number(lender.maxTenure)
                    : null
              }))
          : [];

        if (controller.signal.aborted) return;

        setLenders(availableLenders);
        setRatesAsOf(data.asOf || null);

        if (availableLenders.length > 0) {
          const firstLender = availableLenders[0];

          setSelectedLenderId(firstLender.id);
          setInterestRate(firstLender.minRate);

          if (firstLender.maxTenure) {
            setTenure((current) =>
              Math.min(current, firstLender.maxTenure)
            );
          }
        } else {
          setSelectedLenderId("");
          setLenderError(
            "No lender rates are currently available. You can still use the calculator."
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setLenderError(
            "Unable to load external lender rates. You can still calculate EMI manually."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLendersLoading(false);
        }
      }
    };

    fetchLenders();

    return () => controller.abort();
  }, []);

  const formatMoney = (amount) =>
    "₹" + Math.round(Number(amount) || 0).toLocaleString("en-IN");

  // EMI calculation
  const principal = Math.max(0, price - downPayment);
  const months = tenure * 12;
  const monthlyRate = interestRate / 1200;

  const emi =
    principal <= 0
      ? 0
      : monthlyRate === 0
        ? principal / months
        : (principal *
            monthlyRate *
            Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = emi * months;
  const totalInterest = Math.max(0, totalPayment - principal);

  const goToCalculator = () => {
    document.getElementById("home-loan-calculator")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const changeBannerMessage = () => {
    setMessageIndex(
      (previous) => (previous + 1) % bannerMessages.length
    );
  };

  const handleLenderChange = (event) => {
    const lenderId = event.target.value;

    const lender = lenders.find(
      (item) => item.id === lenderId
    );

    setSelectedLenderId(lenderId);

    if (lender) {
      setInterestRate(lender.minRate);

      if (lender.maxTenure) {
        setTenure((current) =>
          Math.min(current, lender.maxTenure)
        );
      }
    }

    setResult(null);
  };

  const handleInterestChange = (event) => {
    const rawValue = event.target.value;

    if (rawValue === "") {
      setInterestRate("");
      setResult(null);
      return;
    }

    let value = Number(rawValue);

    if (!Number.isFinite(value)) return;

    const minimum = selectedLender?.minRate ?? 0;
    const maximum = selectedLender?.maxRate ?? 30;

    value = Math.min(maximum, Math.max(minimum, value));

    setInterestRate(value);
    setResult(null);
  };

  const handleTenureChange = (event) => {
    setTenure(Number(event.target.value));
    setResult(null);
  };

  const checkEligibility = (event) => {
    event.preventDefault();

    const income = Number(monthlyIncome);
    const existing = Number(existingEmis);

    if (
      monthlyIncome.trim() === "" ||
      existingEmis.trim() === "" ||
      !Number.isFinite(income) ||
      !Number.isFinite(existing) ||
      income <= 0 ||
      existing < 0
    ) {
      setResult({
        eligible: false,
        message:
          "Please enter a valid monthly income and existing EMI amount."
      });
      return;
    }

    // Illustrative affordability estimate, not bank approval.
    const allowedTotalEmi = income * 0.4;
    const availableEmi = Math.max(
      0,
      allowedTotalEmi - existing
    );

    const currentEmi = Number.isFinite(emi) ? emi : 0;
    const canAfford =
      principal > 0 && availableEmi >= currentEmi;

    setResult({
      eligible: canAfford,
      income,
      existing,
      allowedTotalEmi,
      availableEmi,
      estimatedEmi: currentEmi,
      message: canAfford
        ? "Your estimated EMI fits within this illustrative affordability guideline."
        : "The estimated EMI is above your available EMI budget."
    });
  };

  const validInterestRate =
    interestRate !== "" &&
    Number.isFinite(Number(interestRate)) &&
    Number(interestRate) >= 0;

  return (
    <section className="home-loan-section">
      {/* Interactive premium banner */}
      <div className="home-loan-banner">
        <div className="loan-banner-glow loan-banner-glow-one" />
        <div className="loan-banner-glow loan-banner-glow-two" />

        <div className="loan-banner-topline">
          <span className="loan-banner-brand">
            <span className="loan-brand-icon">⌂</span>
            HOMEESTATE FINANCE
          </span>

          <span className="loan-banner-tag">
            YOUR DREAM, YOUR PLAN
          </span>
        </div>

        <div className="loan-banner-layout">
          <div className="home-loan-banner-content">
            <span className="home-loan-eyebrow">
              THE HOME-BUYING REALITY CHECK
            </span>

            <h2>
              {currentMessage.title}
              <span className="loan-banner-highlight">
                {currentMessage.highlight}
              </span>
            </h2>

            <p className="loan-banner-description">
              {currentMessage.description}
            </p>

            <div className="loan-banner-actions">
              <button
                type="button"
                className="loan-banner-cta"
                onClick={goToCalculator}
              >
                {currentMessage.button}
                <span className="loan-cta-arrow">→</span>
              </button>

              <button
                type="button"
                className="loan-banner-refresh"
                onClick={changeBannerMessage}
                aria-label="Show another home loan message"
                title="Give me another message"
              >
                <span aria-hidden="true">↻</span>
                Another one
              </button>
            </div>

            <div className="loan-banner-trust">
              <span>✓</span> No sign-up required
              <span className="loan-trust-divider">·</span>
              <span>✓</span> Free EMI estimate
            </div>
          </div>

          {/* Floating house illustration */}
          <div
            className="loan-banner-visual"
            role="img"
            aria-label="Illustration of a dream home"
          >
            <div className="loan-visual-orbit orbit-one" />
            <div className="loan-visual-orbit orbit-two" />

            <div className="loan-visual-spark spark-one">✦</div>
            <div className="loan-visual-spark spark-two">✧</div>
            <div className="loan-visual-spark spark-three">✦</div>

            <div className="loan-floating-coin coin-one">₹</div>
            <div className="loan-floating-coin coin-two">₹</div>

            <div className="loan-house-card">
              <div className="loan-house-sky">
                <span className="loan-house-cloud cloud-one" />
                <span className="loan-house-cloud cloud-two" />

                <div className="loan-house">
                  <div className="loan-house-roof" />

                  <div className="loan-house-body">
                    <div className="loan-house-window window-left">
                      <span />
                    </div>

                    <div className="loan-house-door">
                      <span />
                    </div>

                    <div className="loan-house-window window-right">
                      <span />
                    </div>
                  </div>

                  <div className="loan-house-base" />
                </div>
              </div>

              <div className="loan-house-caption">
                <span className="loan-caption-icon">⌂</span>

                <div>
                  <strong>Dream Home</strong>
                  <small>Let's make it realistic</small>
                </div>

                <span className="loan-caption-check">✓</span>
              </div>
            </div>

            <div className="loan-visual-pill pill-top">
              <span>✨</span> Big dreams
            </div>

            <div className="loan-visual-pill pill-bottom">
              <span>📊</span> Smart planning
            </div>
          </div>
        </div>

        {/* Live EMI preview */}
        <button
          type="button"
          className="loan-banner-emi-preview"
          onClick={goToCalculator}
          aria-label={`View estimated EMI of ${formatMoney(emi)} per month`}
        >
          <span className="emi-preview-icon">₹</span>

          <span className="emi-preview-copy">
            <small>YOUR ESTIMATED MONTHLY EMI</small>
            <strong>
              {formatMoney(emi)}
              <span>/month</span>
            </strong>
          </span>

          <span className="emi-preview-divider" />

          <span className="emi-preview-note">
            Based on this property's price
            <small>Tap to customise your numbers ↗</small>
          </span>

          <span className="emi-preview-arrow">→</span>
        </button>
      </div>

      {/* EMI calculator */}
      <div
        className="home-loan-panel"
        id="home-loan-calculator"
      >
        <div className="home-loan-heading">
          <span className="home-loan-label">
            PLAN YOUR PURCHASE
          </span>

          <h2>Home Loan EMI Calculator</h2>

          <p>
            Compare indicative lender rates and adjust your numbers
            to estimate your monthly payment.
          </p>
        </div>

        <div className="home-loan-calculator-grid">
          <div className="home-loan-controls">
            {/* Lender selection */}
            <div className="loan-field">
              <label htmlFor="loan-lender">
                Select Bank / Lender
              </label>

              <select
                id="loan-lender"
                value={selectedLenderId}
                disabled={
                  lendersLoading || lenders.length === 0
                }
                onChange={handleLenderChange}
              >
                {lendersLoading && (
                  <option value="">Loading lenders...</option>
                )}

                {!lendersLoading && lenders.length === 0 && (
                  <option value="">No lenders available</option>
                )}

                {lenders.map((lender) => (
                  <option
                    key={lender.id}
                    value={lender.id}
                  >
                    {lender.name} ({lender.minRate}%–
                    {lender.maxRate}%)
                  </option>
                ))}
              </select>

              {lendersLoading && (
                <small>Fetching current lender data...</small>
              )}

              {selectedLender && (
                <small>
                  Indicative rate range:{" "}
                  {selectedLender.minRate}%–
                  {selectedLender.maxRate}% p.a.
                </small>
              )}

              {lenderError && (
                <small role="status">{lenderError}</small>
              )}
            </div>

            {/* Property price */}
            <div className="loan-field">
              <label htmlFor="loan-property-price">
                Property Price (₹)
              </label>

              <input
                id="loan-property-price"
                type="number"
                min="0"
                value={price}
                onChange={(event) => {
                  const value = Math.max(
                    0,
                    Number(event.target.value) || 0
                  );

                  setPrice(value);
                  setDownPayment((previous) =>
                    Math.min(previous, value)
                  );
                  setResult(null);
                }}
              />
            </div>

            {/* Down payment */}
            <div className="loan-field">
              <label htmlFor="loan-down-payment">
                Down Payment (₹)
              </label>

              <input
                id="loan-down-payment"
                type="number"
                min="0"
                max={price}
                value={downPayment}
                onChange={(event) => {
                  const value = Math.max(
                    0,
                    Number(event.target.value) || 0
                  );

                  setDownPayment(Math.min(value, price));
                  setResult(null);
                }}
              />

              <input
                className="loan-range"
                aria-label="Adjust down payment"
                type="range"
                min="0"
                max={Math.max(price, 1)}
                step={Math.max(1, Math.round(price / 1000))}
                value={Math.min(downPayment, Math.max(price, 1))}
                onChange={(event) => {
                  setDownPayment(
                    Math.min(Number(event.target.value), price)
                  );
                  setResult(null);
                }}
              />
            </div>

            {/* Interest rate */}
            <div className="loan-field">
              <label htmlFor="loan-interest">
                Annual Interest Rate (%)
              </label>

              <input
                id="loan-interest"
                type="number"
                min={selectedLender?.minRate ?? 0}
                max={selectedLender?.maxRate ?? 30}
                step="0.1"
                value={interestRate}
                onChange={handleInterestChange}
                onBlur={() => {
                  if (interestRate === "") {
                    setInterestRate(
                      selectedLender?.minRate ?? 8.5
                    );
                  }
                }}
              />

              {selectedLender && (
                <small>
                  Rate range for {selectedLender.name}:{" "}
                  {selectedLender.minRate}%– 
                  {selectedLender.maxRate}%
                </small>
              )}
            </div>

            {/* Tenure */}
            <div className="loan-field">
              <label htmlFor="loan-tenure">
                Loan Tenure
              </label>

              <select
                id="loan-tenure"
                value={tenure}
                onChange={handleTenureChange}
              >
                {[5, 10, 15, 20, 25, 30].map((years) => (
                  <option
                    key={years}
                    value={years}
                    disabled={
                      selectedLender?.maxTenure
                        ? years > selectedLender.maxTenure
                        : false
                    }
                  >
                    {years} years
                  </option>
                ))}
              </select>

              {selectedLender?.maxTenure && (
                <small>
                  Maximum tenure reported by API:{" "}
                  {selectedLender.maxTenure} years
                </small>
              )}
            </div>
          </div>

          {/* EMI results */}
          <div className="home-loan-result">
            <span className="loan-result-label">
              YOUR ESTIMATED MONTHLY EMI
            </span>

            <h3>{formatMoney(emi)}</h3>

            <div className="loan-result-row">
              <span>Property Price</span>
              <strong>{formatMoney(price)}</strong>
            </div>

            <div className="loan-result-row">
              <span>Down Payment</span>
              <strong>{formatMoney(downPayment)}</strong>
            </div>

            <div className="loan-result-row">
              <span>Loan Amount</span>
              <strong>{formatMoney(principal)}</strong>
            </div>

            <div className="loan-result-row">
              <span>Total Interest</span>
              <strong>{formatMoney(totalInterest)}</strong>
            </div>

            <div className="loan-result-row">
              <span>Total Repayment</span>
              <strong>{formatMoney(totalPayment)}</strong>
            </div>

            <div className="loan-result-row">
              <span>Interest Rate</span>
              <strong>
                {validInterestRate
                  ? `${Number(interestRate).toFixed(2)}%`
                  : "—"}
              </strong>
            </div>

            <div className="loan-result-row">
              <span>Loan Tenure</span>
              <strong>{tenure} years</strong>
            </div>

            <p className="loan-result-note">
              Estimates exclude processing fees, insurance, taxes,
              and other charges. Actual lender rates and terms may
              differ.
            </p>

            <p className="loan-api-attribution">
              {selectedLender
                ? `Selected lender: ${selectedLender.name}. `
                : ""}
              Rates are indicative. Confirm the final rate and
              eligibility with the lender.
              {ratesAsOf ? ` Data date: ${ratesAsOf}.` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Affordability checker */}
      <div className="home-loan-panel loan-eligibility-panel">
        <div className="home-loan-heading">
          <span className="home-loan-label">
            A QUICK BUDGET CHECK
          </span>

          <h2>Can Your Monthly Budget Handle It?</h2>

          <p>
            Enter your income and existing monthly EMIs for an
            illustrative affordability estimate.
          </p>
        </div>

        <form
          className="eligibility-form"
          onSubmit={checkEligibility}
        >
          <div className="loan-field">
            <label htmlFor="loan-monthly-income">
              Monthly Take-Home Income (₹)
            </label>

            <input
              id="loan-monthly-income"
              type="number"
              min="1"
              placeholder="e.g. 80000"
              value={monthlyIncome}
              onChange={(event) => {
                setMonthlyIncome(event.target.value);
                setResult(null);
              }}
              required
            />
          </div>

          <div className="loan-field">
            <label htmlFor="loan-existing-emis">
              Existing Monthly EMIs (₹)
            </label>

            <input
              id="loan-existing-emis"
              type="number"
              min="0"
              placeholder="e.g. 10000"
              value={existingEmis}
              onChange={(event) => {
                setExistingEmis(event.target.value);
                setResult(null);
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="loan-banner-cta"
            disabled={!validInterestRate}
          >
            Check My Budget
            <span className="loan-cta-arrow">→</span>
          </button>
        </form>

        {result && (
          <div
            className={`eligibility-result ${
              result.eligible ? "is-affordable" : "is-not-affordable"
            }`}
            role="status"
          >
            <h3>
              {result.eligible
                ? "Your budget looks promising!"
                : "Let's review your budget"}
            </h3>

            <p>{result.message}</p>

            {result.income !== undefined && (
              <>
                <div className="loan-result-row">
                  <span>Monthly Income</span>
                  <strong>{formatMoney(result.income)}</strong>
                </div>

                <div className="loan-result-row">
                  <span>Existing EMIs</span>
                  <strong>{formatMoney(result.existing)}</strong>
                </div>

                <div className="loan-result-row">
                  <span>Illustrative EMI Budget</span>
                  <strong>
                    {formatMoney(result.allowedTotalEmi)}
                  </strong>
                </div>

                <div className="loan-result-row">
                  <span>Available EMI Budget</span>
                  <strong>
                    {formatMoney(result.availableEmi)}
                  </strong>
                </div>

                <div className="loan-result-row">
                  <span>Estimated Property EMI</span>
                  <strong>
                    {formatMoney(result.estimatedEmi)}
                  </strong>
                </div>
              </>
            )}

            <p className="loan-result-note">
              This is only an estimate using a 40% income guideline.
              It is not a bank eligibility decision or loan approval.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeLoanCalculator;