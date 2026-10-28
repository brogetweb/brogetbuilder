
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WhyChooseUsSection.css";

const benefits = [
  {
    title: "Find Your Perfect Property",
    description:
      "Explore apartments, villas, plots, independent houses, and builder floors in your preferred location. Filter properties by budget, property type, and requirements to find a home that suits your lifestyle.",
  },
  {
    title: "Connect with Property Owners & Builders",
    description:
      "Connect with property owners and builders to enquire about listings, understand property details, schedule visits, and get the information you need before making a decision.",
  },
  {
    title: "Buy, Sell & Rent with Confidence",
    description:
      "Whether you are searching for your dream home, selling your property, or looking for tenants, BuilderBro brings property seekers, owners, and builders together on one platform.",
  },
];

const highlights = [
  "Explore Residential and Commercial Properties",
  "Discover New Launches and Upcoming Projects",
  "Connect with Property Owners and Builders",
  "Find Properties Based on Your Budget and Location",
  "List Your Property and Reach Potential Buyers",
];

function WhyChooseUsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleAppointment = () => {
    navigate("/contact-us");
  };

  return (
    <section className="bb-why-section" id="why-choose-us">
      <div className="bb-why-container">
        {/* LEFT CONTENT */}
        <div className="bb-why-content">
          <div className="bb-section-label">
            WHY CHOOSE BUILDERBROGET
          </div>

          <h2 className="bb-section-title">
            YOUR PROPERTY
            <br />
            JOURNEY STARTS HERE
          </h2>

          <p className="bb-section-intro">
            Buying, selling, or renting a property should feel simple
            and straightforward. BuilderBro connects customers,
            property owners, and builders to help you discover
            opportunities and make informed real estate decisions.
          </p>

          <div className="bb-accordion">
            {benefits.map((benefit, index) => {
              const isActive = activeIndex === index;

              return (
                <article
                  className={`bb-accordion-item ${
                    isActive ? "bb-accordion-active" : ""
                  }`}
                  key={benefit.title}
                >
                  <button
                    className="bb-accordion-trigger"
                    type="button"
                    onClick={() =>
                      setActiveIndex(isActive ? -1 : index)
                    }
                    aria-expanded={isActive}
                  >
                    <span className="bb-accordion-number">
                      0{index + 1}
                    </span>

                    <span className="bb-accordion-heading">
                      {benefit.title}
                    </span>

                    <span
                      className={`bb-accordion-icon ${
                        isActive ? "bb-icon-active" : ""
                      }`}
                      aria-hidden="true"
                    >
                      {isActive ? "−" : "+"}
                    </span>
                  </button>

                  {isActive && (
                    <div className="bb-accordion-body">
                      <p>{benefit.description}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <button
            className="bb-appointment-btn"
            type="button"
            onClick={handleAppointment}
          >
            <span>Get in Touch with Us</span>
            <span className="bb-button-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        </div>

        {/* RIGHT IMAGE AND BENEFITS */}
        <div className="bb-why-visual">
          <img
            className="bb-construction-image"
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
            alt="Modern residential property with contemporary architecture"
            loading="lazy"
          />

          <div className="bb-image-overlay" />

          <div className="bb-image-caption">
            <span className="bb-caption-dot" />
            FIND YOUR SPACE. BUILD YOUR FUTURE.
          </div>

          <div className="bb-benefits-card">
            <div className="bb-benefits-eyebrow">
              THE BUILDERBROGET ADVANTAGE
            </div>

            <h3>Real Estate Made Simpler.</h3>

            <ul className="bb-benefits-list">
              {highlights.map((highlight) => (
                <li key={highlight}>
                  <span className="bb-check" aria-hidden="true">
                    ✓
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="bb-benefits-footer">
              <span className="bb-footer-mark">BB</span>
              <span>Your property. Your possibilities.</span>
            </div>
          </div>

          <div className="bb-image-badge">
            <span className="bb-badge-icon" aria-hidden="true">
              ⌂
            </span>
            <div>
              <strong>Buy. Sell. Rent.</strong>
              <span>Your real estate journey starts here</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUsSection;
