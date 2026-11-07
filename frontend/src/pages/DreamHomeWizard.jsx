
import { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import "./DreamHomeWizard.css";

const budgetOptions = [
  { label: "Below ₹25 Lakh", min: 0, max: 2500000 },
  { label: "₹25–50 Lakh", min: 2500000, max: 5000000 },
  { label: "₹50 Lakh–₹1 Crore", min: 5000000, max: 10000000 },
  { label: "₹1–2 Crore", min: 10000000, max: 20000000 },
  { label: "Above ₹2 Crore", min: 20000000, max: Infinity },
];

const propertyTypes = [
  "Apartment",
  "Villa",
  "Plot",
  "Independent House",
  "Builder Floor",
];

const bedroomOptions = ["Any", "1 BHK", "2 BHK", "3 BHK", "4 BHK"];

const amenityOptions = [
  "Parking",
  "Lift",
  "Security",
  "Power Backup",
  "Swimming Pool",
  "Water Connection",
  "Gym",
  "Garden",
  "Terrace",
  "Club House",
];

const furnishingOptions = [
  "Any",
  "Furnished",
  "Semi-Furnished",
  "Unfurnished",
];

const projectStatusOptions = [
  "Any",
  "New Launch",
  "Under Construction",
  "Ready to Move",
];

const initialAnswers = {
  listingType: "Buy",
  city: "",
  budget: "",
  propertyType: "Apartment",
  bedrooms: "2 BHK",
  furnishing: "Any",
  projectStatus: "Any",
  amenities: [],
};

const quizSteps = [
  "Requirement",
  "Location",
  "Budget",
  "Property Type",
  "Configuration",
  "Preference",
  "Amenities",
];

const getItemsFromResponse = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "Price on request";
  }

  return `₹${Number(price).toLocaleString("en-IN")}`;
};

const matchesBedrooms = (item, selectedBedrooms, isProject) => {
  if (!selectedBedrooms || selectedBedrooms === "Any") {
    return true;
  }

  const requestedNumber = Number.parseInt(selectedBedrooms, 10);

  if (isProject) {
    const configurations = item.configurations || [];

    // Do not reject a project when configuration data is unavailable.
    if (!configurations.length) return true;

    return configurations.some((configuration) => {
      const match = String(configuration).match(/(\d+)\s*BHK/i);
      return match && Number(match[1]) === requestedNumber;
    });
  }

  // Do not reject a property when bedroom data is unavailable.
  if (!item.bedrooms) return true;

  return Number(item.bedrooms) === requestedNumber;
};

const matchesAmenities = (item, selectedAmenities) => {
  if (!selectedAmenities.length) return true;

  const availableAmenities = (item.amenities || []).map((amenity) =>
    String(amenity).toLowerCase()
  );

  // Every selected amenity is treated as a must-have.
  return selectedAmenities.every((amenity) =>
    availableAmenities.includes(amenity.toLowerCase())
  );
};

const matchesBudget = (item, budget, isProject) => {
  if (!budget) return true;

  const selectedBudget = budgetOptions.find(
    (option) => option.label === budget
  );

  if (!selectedBudget) return true;

  if (isProject) {
    const projectMin = Number(item.minPrice);
    const projectMax = Number(item.maxPrice);

    if (!Number.isFinite(projectMin) || !Number.isFinite(projectMax)) {
      return true;
    }

    // A project's price range must overlap the selected budget.
    return (
      projectMax >= selectedBudget.min &&
      projectMin <= selectedBudget.max
    );
  }

  const price = Number(item.price);

  if (!Number.isFinite(price)) return true;

  return (
    price >= selectedBudget.min &&
    price <= selectedBudget.max
  );
};

function DreamHomeWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const isProject = answers.listingType === "New Project";

  const updateAnswer = (field, value) => {
    setAnswers((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleAmenity = (amenity) => {
    setAnswers((previous) => {
      const alreadySelected = previous.amenities.includes(amenity);

      return {
        ...previous,
        amenities: alreadySelected
          ? previous.amenities.filter((item) => item !== amenity)
          : [...previous.amenities, amenity],
      };
    });
  };

  const handleNext = () => {
    if (step < quizSteps.length - 1) {
      setStep((previous) => previous + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((previous) => previous - 1);
    }
  };

  const resetWizard = () => {
    setStep(0);
    setAnswers(initialAnswers);
    setResults([]);
    setSearched(false);
    setError("");
  };

  const findMatches = async () => {
    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const endpoint = isProject ? "projects" : "properties";

      const response = await fetch(
        `${API_URL}/${endpoint}`
      );
     

      if (!response.ok) {
        throw new Error(
          `Unable to load ${isProject ? "projects" : "properties"}.`
        );
      }

      const data = await response.json();
       console.log("API Response:", data);

      const items = getItemsFromResponse(
        data,
        isProject ? "projects" : "properties"
      );

      console.log("Total Items:", items.length);
console.log("All Items:", items);

console.log("Selected Answers:", answers);
console.table(
  items.map((item) => ({
    title: item.title || item.name,
    city: item.city,
    location: item.location,
    listingType: item.listingType,
    propertyType: item.propertyType,
    price: item.price,
    bedrooms: item.bedrooms,
    furnishing: item.furnishing,
    configurations: item.configurations,
    amenities: item.amenities,
  }))
);

      const filteredItems = items.filter((item) => {
        // Location matching
        if (answers.city.trim()) {
          const searchCity = answers.city.trim().toLowerCase();

          const itemCity = String(item.city || "").toLowerCase();
          const itemLocation = String(item.location || "").toLowerCase();

          if (
            !itemCity.includes(searchCity) &&
            !itemLocation.includes(searchCity)
          ) {
            return false;
          }
        }

        // Property type matching
        if (
          answers.propertyType &&
          item.propertyType &&
          item.propertyType !== answers.propertyType
        ) {
          return false;
        }

        // Listing type matching
        if (!isProject && item.listingType) {
          if (item.listingType !== answers.listingType) {
            return false;
          }
        }

        // Budget matching
        if (!matchesBudget(item, answers.budget, isProject)) {
          return false;
        }

        // Bedroom/configuration matching
        if (!matchesBedrooms(item, answers.bedrooms, isProject)) {
          return false;
        }

        // Amenities matching
        if (!matchesAmenities(item, answers.amenities)) {
          return false;
        }

        // Project possession status
        if (
          isProject &&
          answers.projectStatus !== "Any" &&
          item.status &&
          item.status !== answers.projectStatus
        ) {
          return false;
        }

        // Property furnishing
        if (
          !isProject &&
          answers.furnishing !== "Any" &&
          item.furnishing &&
          item.furnishing !== answers.furnishing
        ) {
          return false;
        }

        return true;
      });

      console.log("Matching Items:", filteredItems);
console.log("Matching Count:", filteredItems.length);

      setResults(filteredItems);
      setSearched(true);
    } catch (err) {
      console.error("Dream Home Match Error:", err);
      setError(
        err.message || "Something went wrong while finding your matches."
      );
    } finally {
      setLoading(false);
    }
  };

  const getItemPrice = (item) => {
    if (isProject) {
      return `${formatPrice(item.minPrice)} - ${formatPrice(item.maxPrice)}`;
    }

    return formatPrice(item.price);
  };

  const getItemTitle = (item) => {
    return item.title || item.name || item.propertyType || "Property";
  };

  const getItemImage = (item) => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }

    return "";
  };

  const getDetailLink = (item) => {
    const id = item._id || item.id;

    if (!id) return "#";

    // Change the property URL below if your App.jsx uses another route.
    return isProject
      ? `/project/${id}`
      : `/property/${id}`;
  };

  const renderChoice = (value, selected, onClick, description = "") => (
    <button
      type="button"
      className={`dream-choice ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <span className="dream-choice-check">
        {selected ? "✓" : ""}
      </span>

      <span className="dream-choice-label">{value}</span>

      {description && (
        <span className="dream-choice-description">
          {description}
        </span>
      )}
    </button>
  );

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <span className="dream-step-kicker">LET'S GET STARTED</span>

            <h2>What are you looking for?</h2>

            <p className="dream-step-description">
              Tell us what kind of property you have in mind.
            </p>

            <div className="dream-choice-grid dream-intent-grid">
              {renderChoice(
                "Buy a Property",
                answers.listingType === "Buy",
                () => updateAnswer("listingType", "Buy"),
                "Find a home to own"
              )}

              {renderChoice(
                "Rent a Property",
                answers.listingType === "Rent",
                () => updateAnswer("listingType", "Rent"),
                "Find a place to rent"
              )}

              {renderChoice(
                "PG Accommodation",
                answers.listingType === "PG",
                () => updateAnswer("listingType", "PG"),
                "Find a comfortable PG"
              )}

              {renderChoice(
                "New Project",
                answers.listingType === "New Project",
                () => updateAnswer("listingType", "New Project"),
                "Explore upcoming projects"
              )}
            </div>
          </>
        );

      case 1:
        return (
          <>
            <span className="dream-step-kicker">YOUR PREFERRED LOCATION</span>

            <h2>Where would you like to live?</h2>

            <p className="dream-step-description">
              Enter your preferred city or locality.
            </p>

            <div className="dream-input-wrapper">
              <label htmlFor="dream-city">City or locality</label>

              <input
                id="dream-city"
                type="text"
                placeholder="e.g. chhatrapati sambhajinagar, Pune, Mumbai..."
                value={answers.city}
                onChange={(e) => updateAnswer("city", e.target.value)}
              />

              <span className="dream-input-hint">
                You can leave this blank to explore all available locations.
              </span>
            </div>

            <div className="dream-location-suggestions">
              {["chhatrapati sambhajinagar", "Pune", "Mumbai", "Nashik", "Hyderabad"].map(
                (city) => (
                  <button
                    type="button"
                    key={city}
                    className={
                      answers.city === city ? "active" : ""
                    }
                    onClick={() => updateAnswer("city", city)}
                  >
                    {city}
                  </button>
                )
              )}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <span className="dream-step-kicker">YOUR BUDGET</span>

            <h2>What is your budget?</h2>

            <p className="dream-step-description">
              Choose a comfortable budget range.
            </p>

            <div className="dream-choice-grid dream-budget-grid">
              {budgetOptions.map((option) =>
                renderChoice(
                  option.label,
                  answers.budget === option.label,
                  () => updateAnswer("budget", option.label)
                )
              )}
            </div>

            <button
              type="button"
              className={`dream-any-option ${
                answers.budget === "" ? "active" : ""
              }`}
              onClick={() => updateAnswer("budget", "")}
            >
              No fixed budget
            </button>
          </>
        );

      case 3:
        return (
          <>
            <span className="dream-step-kicker">PROPERTY PREFERENCE</span>

            <h2>Which property type do you prefer?</h2>

            <p className="dream-step-description">
              Select the type of property you want to explore.
            </p>

            <div className="dream-choice-grid dream-property-grid">
              {propertyTypes.map((type) =>
                renderChoice(
                  type,
                  answers.propertyType === type,
                  () => updateAnswer("propertyType", type)
                )
              )}
            </div>

            <button
              type="button"
              className={`dream-any-option ${
                answers.propertyType === "" ? "active" : ""
              }`}
              onClick={() => updateAnswer("propertyType", "")}
            >
              Show all property types
            </button>
          </>
        );

      case 4:
        return (
          <>
            <span className="dream-step-kicker">CONFIGURATION</span>

            <h2>How much space do you need?</h2>

            <p className="dream-step-description">
              Select your preferred bedroom configuration.
            </p>

            <div className="dream-choice-grid dream-bedroom-grid">
              {bedroomOptions.map((bedroom) =>
                renderChoice(
                  bedroom,
                  answers.bedrooms === bedroom,
                  () => updateAnswer("bedrooms", bedroom)
                )
              )}
            </div>

            <span className="dream-input-hint">
              Configuration matching uses the bedroom and project
              configuration information available in your listings.
            </span>
          </>
        );

      case 5:
        return (
          <>
            <span className="dream-step-kicker">ONE MORE PREFERENCE</span>

            <h2>
              {isProject
                ? "When would you like possession?"
                : "What furnishing do you prefer?"}
            </h2>

            <p className="dream-step-description">
              Choose an option or keep it flexible.
            </p>

            <div className="dream-choice-grid">
              {(isProject
                ? projectStatusOptions
                : furnishingOptions
              ).map((option) =>
                renderChoice(
                  option,
                  isProject
                    ? answers.projectStatus === option
                    : answers.furnishing === option,
                  () =>
                    updateAnswer(
                      isProject ? "projectStatus" : "furnishing",
                      option
                    )
                )
              )}
            </div>
          </>
        );

      case 6:
        return (
          <>
            <span className="dream-step-kicker">YOUR MUST-HAVES</span>

            <h2>Which amenities matter to you?</h2>

            <p className="dream-step-description">
              Select the facilities you would like in your property.
              You can skip this step.
            </p>

            <div className="dream-amenity-grid">
              {amenityOptions.map((amenity) => {
                const selected = answers.amenities.includes(amenity);

                return (
                  <button
                    type="button"
                    key={amenity}
                    className={`dream-amenity ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() => toggleAmenity(amenity)}
                  >
                    <span>{selected ? "✓" : "+"}</span>
                    {amenity}
                  </button>
                );
              })}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (searched) {
    return (
      <div className="dream-page">
        <div className="dream-results-container">
          <div className="dream-results-heading">
            <span className="dream-step-kicker">YOUR MATCH RESULTS</span>

            <h1>Let's find your dream home.</h1>

            <p>
              Based on your selected preferences, here are the available
              {isProject ? " projects" : " properties"}.
            </p>

            <div className="dream-results-summary">
              <span>
                <strong>{results.length}</strong> matching results
              </span>

              <button type="button" onClick={resetWizard}>
                Start Again
              </button>
            </div>
          </div>

          {error && (
            <div className="dream-error">
              {error}
            </div>
          )}

          {results.length > 0 ? (
            <div className="dream-results-grid">
              {results.map((item) => {
                const image = getItemImage(item);
                const title = getItemTitle(item);
                const detailLink = getDetailLink(item);

                return (
                  <article
                    className="dream-result-card"
                    key={item._id || item.id}
                  >
                    <div className="dream-result-image">
                      {image ? (
                        <img src={image} alt={title} />
                      ) : (
                        <div className="dream-image-placeholder">
                          BUILDERBROGET
                        </div>
                      )}

                      {item.verified && (
                        <span className="dream-verified">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    <div className="dream-result-content">
                      <span className="dream-result-type">
                        {isProject ? "NEW PROJECT" : item.listingType}
                      </span>

                      <h3>{title}</h3>

                      <p className="dream-result-location">
                        {item.location || item.city}
                        {item.city && item.location
                          ? `, ${item.city}`
                          : ""}
                      </p>

                      <div className="dream-result-price">
                        {getItemPrice(item)}
                      </div>

                      <div className="dream-result-details">
                        {isProject ? (
                          <>
                            <span>{item.status || "Project"}</span>
                            <span>{item.area || "Area not specified"}</span>
                          </>
                        ) : (
                          <>
                            <span>
                              {item.bedrooms
                                ? `${item.bedrooms} BHK`
                                : item.propertyType}
                            </span>
                            <span>
                              {item.area
                                ? `${item.area} sq.ft.`
                                : "Area not specified"}
                            </span>
                          </>
                        )}
                      </div>

                      {detailLink !== "#" ? (
                        <Link
                          to={detailLink}
                          className="dream-view-button"
                        >
                          View Details <span>→</span>
                        </Link>
                      ) : (
                        <span className="dream-no-link">
                          Details unavailable
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="dream-no-results">
              <div className="dream-no-results-icon">⌂</div>

              <h2>No exact matches found</h2>

              <p>
                Try changing your budget, location or preferences to
                discover more available options.
              </p>

              <button type="button" onClick={resetWizard}>
                Modify Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dream-page">
      <div className="dream-wizard-container">
        <div className="dream-wizard-top">
          <Link to="/" className="dream-back-home">
            ← Back to Home
          </Link>

          <span className="dream-brand">
            BUILDER<span>BROGET</span>
          </span>
        </div>

        <div className="dream-wizard-card">
          <div className="dream-wizard-intro">
            <span className="dream-step-kicker">
              YOUR HOME. YOUR CHOICE.
            </span>

            <h1>Find Your Dream Home</h1>

            <p>
              Answer a few simple questions and discover properties
              that match your lifestyle and budget.
            </p>
          </div>

          <div className="dream-progress">
            <div className="dream-progress-info">
              <span>STEP {step + 1} OF {quizSteps.length}</span>
              <span>{quizSteps[step]}</span>
            </div>

            <div className="dream-progress-track">
              <div
                className="dream-progress-fill"
                style={{
                  width: `${((step + 1) / quizSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="dream-question-area">
            {renderStepContent()}
          </div>

          {error && (
            <div className="dream-error">
              {error}
            </div>
          )}

          <div className="dream-navigation">
            <button
              type="button"
              className="dream-back-button"
              onClick={handleBack}
              disabled={step === 0 || loading}
            >
              ← Back
            </button>

            {step < quizSteps.length - 1 ? (
              <button
                type="button"
                className="dream-next-button"
                onClick={handleNext}
              >
                Continue <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                className="dream-next-button"
                onClick={findMatches}
                disabled={loading}
              >
                {loading ? "Finding Matches..." : "Find My Matches →"}
              </button>
            )}
          </div>
        </div>

        <p className="dream-footer-note">
          BUILDERBROGET REALITY CHECK · FIND A PLACE THAT FEELS LIKE HOME
        </p>
      </div>
    </div>
  );
}

export default DreamHomeWizard;
