import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

import PropertyCard from "../components/PropertyCard";
import HomeLoanCalculator from "../components/HomeLoanCalculator";
import AICallModal from "../components/AICallModal";
import VastuChatbot from "../components/VastuChatbot";
import NearbyEssentials from "../components/NearbyEssentials";

// Generate a stable anonymous visitor ID for guests.
const getAnonymousVisitorId = () => {
  const storageKey = "builderbroget_visitor_id";

  let visitorId = localStorage.getItem(storageKey);

  if (!visitorId) {
    if (typeof crypto.randomUUID === "function") {
      visitorId = crypto.randomUUID();
    } else {
      visitorId = `guest-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
    }

    localStorage.setItem(storageKey, visitorId);
  }

  return visitorId;
};

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [aiCallOpen, setAiCallOpen] = useState(false);

  // Prevent duplicate visit requests for the same property.
  const lastRecordedVisitId = useRef(null);

  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    message: "",
  });

  // Record visits for both logged-in users and guests.
  const recordVisit = async (propertyId) => {
    if (!propertyId) return;

    // Avoid duplicate requests for the same property.
    if (lastRecordedVisitId.current === propertyId) return;

    lastRecordedVisitId.current = propertyId;

    try {
      const token = localStorage.getItem("token");

      const anonymousVisitorId = token
        ? null
        : getAnonymousVisitorId();

      const response = await axios.post(
        `${API_URL}/visits/${propertyId}`,
        { anonymousVisitorId },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      console.log(
        "Property visit:",
        response.data?.message || "Visit recorded"
      );
    } catch (error) {
      // Allow another attempt if tracking fails.
      if (lastRecordedVisitId.current === propertyId) {
        lastRecordedVisitId.current = null;
      }

      console.error(
        "Visit tracking error:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Fetch property details and similar properties.
  useEffect(() => {
    let isActive = true;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setProperty(null);
        setSelectedImage("");
        setSimilarProperties([]);

        const response = await axios.get(
          `${API_URL}/properties/${id}`
        );

        if (!isActive) return;

        const propertyData = response.data;

        setProperty(propertyData);

        if (propertyData.images?.length > 0) {
          setSelectedImage(propertyData.images[0]);
        }

        // Track the visit after fetching the property.
        if (propertyData._id) {
          recordVisit(propertyData._id);
        }

        // Fetch similar properties.
        try {
          const similarResponse = await axios.get(
            `${API_URL}/properties/similar/${id}`
          );

          if (isActive) {
            setSimilarProperties(
              Array.isArray(similarResponse.data)
                ? similarResponse.data
                : []
            );
          }
        } catch (error) {
          console.error(
            "Similar properties error:",
            error.response?.data?.message || error.message
          );
        }
      } catch (error) {
        console.error(
          "Fetch property error:",
          error.response?.data?.message || error.message
        );

        if (isActive) {
          setProperty(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProperty();
    } else {
      setLoading(false);
      setProperty(null);
    }

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleEnquiryChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Save the enquiry and then open WhatsApp.
  const sendToWhatsApp = async (event) => {
    event.preventDefault();

    if (!property) {
      setEnquiryMessage("Property details are not available.");
      return;
    }

    if (
      !formData.senderName.trim() ||
      !formData.senderPhone.trim() ||
      !formData.message.trim()
    ) {
      setEnquiryMessage("Please fill all required fields.");
      return;
    }

    setEnquiryLoading(true);
    setEnquiryMessage("");

    try {
      const enquiryResponse = await axios.post(
        `${API_URL}/enquiries`,
        {
          property: property._id,
          name: formData.senderName.trim(),
          phone: formData.senderPhone.trim(),
          email: formData.senderEmail.trim(),
          message: formData.message.trim(),
        }
      );

      console.log("Enquiry saved:", enquiryResponse.data);

      let ownerPhone = String(
        property.contactNumber || ""
      ).replace(/\D/g, "");

      if (ownerPhone.startsWith("0091")) {
        ownerPhone = ownerPhone.slice(2);
      }

      if (
        ownerPhone.startsWith("0") &&
        ownerPhone.length === 11
      ) {
        ownerPhone = ownerPhone.slice(1);
      }

      if (ownerPhone.length === 10) {
        ownerPhone = `91${ownerPhone}`;
      }

      if (!ownerPhone) {
        setEnquiryMessage(
          "Enquiry saved, but the owner's WhatsApp number is unavailable."
        );

        setFormData({
          senderName: "",
          senderPhone: "",
          senderEmail: "",
          message: "",
        });

        return;
      }

      const whatsappMessage = `Hello ${
        property.ownerName || "Property Owner"
      },

I am interested in your property listed on BuilderBroget.

Property: ${property.title}
Location: ${property.location}, ${property.city}
Price: ${
        property.price != null
          ? `₹${Number(property.price).toLocaleString("en-IN")}`
          : "Price on request"
      }
Listing Type: ${property.listingType}

My Details:
Name: ${formData.senderName}
Phone: ${formData.senderPhone}
Email: ${formData.senderEmail}

Enquiry:
${formData.message}

Please contact me regarding this property.

Thank you.
BuilderBroget`;

      const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setEnquiryMessage(
        "Enquiry saved successfully. Opening WhatsApp..."
      );

      setFormData({
        senderName: "",
        senderPhone: "",
        senderEmail: "",
        message: "",
      });
    } catch (error) {
      console.error("ENQUIRY ERROR:", error);
      console.error("SERVER RESPONSE:", error.response?.data);

      setEnquiryMessage(
        error.response?.data?.message ||
          "Unable to save enquiry. Please try again."
      );
    } finally {
      setEnquiryLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return "Price on request";
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return String(price);
    }

    return `₹${numericPrice.toLocaleString("en-IN")}`;
  };

  const formatArea = (area) => {
    if (
      area === undefined ||
      area === null ||
      area === ""
    ) {
      return "Not specified";
    }

    return typeof area === "number" ||
      !Number.isNaN(Number(area))
      ? `${Number(area).toLocaleString("en-IN")} sq.ft`
      : String(area);
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          <span className="loading-orbit" />
          <p>Preparing your property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="details-page">
        <div className="details-error">
          <span className="error-index">404 / PROPERTY</span>
          <h2>This property is unavailable.</h2>
          <p>
            It may have been removed or the link may no longer be valid.
          </p>
          <Link to="/" className="details-back-home">
            Back to properties
          </Link>
        </div>
      </div>
    );
  }

  const images =
    property.images?.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000",
        ];

  const amenities = Array.isArray(property.amenities)
    ? property.amenities
    : [];


  // Only Apartments show floor and total floors.
  const isApartment = property.propertyType === "Apartment";

  const propertyFacts = [
    {
      number: property.bedrooms ?? "—",
      label: "Bedrooms",
      symbol: "01",
    },
    {
      number: property.balconies ?? "—",
      label: "Balconies",
      symbol: "02",
    },
    {
      number: formatArea(property.area),
      label: "Built-up area",
      symbol: "03",
    },
    {
      number: property.furnishing || "Not specified",
      label: "Furnishing",
      symbol: "04",
    },
  ];

  return (
    <div className="details-page">
      <div className="details-container">
        {/* Breadcrumb */}
        <nav className="details-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <span>{property.city || "Location"}</span>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">
            {property.title}
          </span>
        </nav>

        {/* Property gallery */}
        <section className="details-gallery-layout">
          <div className="details-gallery-main">
            <img
              src={selectedImage || images[0]}
              alt={property.title}
            />

            <div className="gallery-image-count">
              {images.length}{" "}
              {images.length === 1 ? "IMAGE" : "IMAGES"}
            </div>
          </div>

          {images.length > 1 && (
            <div className="details-gallery-thumbnails">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={
                    selectedImage === image
                      ? "details-thumbnail details-thumbnail-active"
                      : "details-thumbnail"
                  }
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View property image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`Property view ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Property introduction */}
        <section className="property-intro">
          <div className="property-intro-copy">
            <div className="property-eyebrow">
              <span className="eyebrow-line" />
              PROPERTY DETAILS
              <span className="eyebrow-number">BB / 01</span>
            </div>

            <div className="property-status-row">
              <span className="property-type-label">
                {property.propertyType || "Residential Property"}
              </span>

              <span className="property-status">
                <span className="status-dot" />
                {property.listingType || "Property"}
              </span>

              {property.featured && (
                <span className="property-featured-label">
                  FEATURED
                </span>
              )}

              {property.verified && (
                <span className="property-verified-label">
                  ✓ VERIFIED
                </span>
              )}
            </div>

            <h2 className="property-editorial-title">
              {property.title}
              <span className="title-period">.</span>
            </h2>

            <p className="property-address">
              <span className="address-symbol">↗</span>
              {property.location || "Location not specified"}
              {property.city ? `, ${property.city}` : ""}
            </p>
          </div>

          <div className="property-price-panel">
            <span className="price-panel-label">ASKING PRICE</span>

            <h2 className="property-price-value">
              {formatPrice(property.price)}
            </h2>

            <div className="price-panel-rule" />

            <div className="price-panel-bottom">
              <span>{property.listingType || "Listing"}</span>
              <span>BUILDERBROGET</span>
            </div>
          </div>
        </section>

        {/* Key facts */}
        <section className="property-facts-section">
          <div className="section-kicker">
            <span>AT A GLANCE</span>
            <span>THE ESSENTIALS</span>
          </div>

          <div className="property-facts-grid">
            {propertyFacts.map((fact) => (
              <div className="property-fact" key={fact.symbol}>
                <span className="fact-index">{fact.symbol}</span>
                <div className="fact-content">
                  <strong>{fact.number}</strong>
                  <span>{fact.label}</span>
                </div>
                <span className="fact-arrow">↗</span>
              </div>
            ))}
          </div>
        </section>

        {/* Main content and enquiry sidebar */}
        <div className="details-content-layout">
          <main className="details-content-main">
            {/* Description */}
            <section className="editorial-section description-section">
              <div className="section-heading-row">
                <div>
                  <span className="section-number">01 / OVERVIEW</span>
                  <h2>
                    A closer look at
                    <br />
                    <span>your next address.</span>
                  </h2>
                </div>

                <span className="section-mark">B.</span>
              </div>

              <div className="description-copy">
                {property.description ? (
                  <p>{property.description}</p>
                ) : (
                  <p>
                    A detailed description has not been provided for
                    this property yet. Contact the owner to learn more
                    about its features and availability.
                  </p>
                )}
              </div>

              <div className="description-footer">
                <span>PROPERTY INFORMATION</span>
                <span>01 — OVERVIEW</span>
              </div>
            </section>

            {/* Property specifications */}
            <section className="editorial-section specifications-section">
              <div className="section-heading-row compact-heading">
                <div>
                  <span className="section-number">
                    02 / SPECIFICATIONS
                  </span>
                  <h2>Property particulars</h2>
                </div>
              </div>

              <div className="specification-list">
                <div className="specification-row">
                  <span className="specification-label">Property type</span>
                  <strong>
                    {property.propertyType || "Not specified"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">Listing type</span>
                  <strong>
                    {property.listingType || "Not specified"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">Bedrooms</span>
                  <strong>
                    {property.bedrooms ?? "Not specified"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">Balconies</span>
                  <strong>
                    {property.balconies ?? "Not specified"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">Bathrooms</span>
                  <strong>
                    {property.bathrooms ?? "Not specified"}
                  </strong>
                </div>

                 <div className="specification-row">
                  <span className="specification-label">Facing</span>
                  <strong>
                    {property.facing || "Not specified"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">Area</span>
                  <strong>{formatArea(property.area)}</strong>
                </div>

                {isApartment && (
                  <>
                    <div className="specification-row">
                      <span className="specification-label">Floor</span>
                      <strong>
                        {property.floor !== undefined &&
                        property.floor !== null &&
                        property.floor !== ""
                          ? property.floor
                          : "Not specified"}
                      </strong>
                    </div>

                    <div className="specification-row">
                      <span className="specification-label">
                        Total Floors
                      </span>
                      <strong>
                        {property.totalFloors !== undefined &&
                        property.totalFloors !== null &&
                        property.totalFloors !== ""
                          ? property.totalFloors
                          : "Not specified"}
                      </strong>
                    </div>
                  </>
                )}


                <div className="specification-row">
                  <span className="specification-label">Furnishing</span>
                  <strong>
                    {property.furnishing || "Not specified"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">City</span>
                  <strong>{property.city || "Not specified"}</strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">Locality</span>
                  <strong>
                    {property.location || "Not specified"}
                  </strong>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className="editorial-section amenities-section">
              <div className="section-heading-row compact-heading">
                <div>
                  <span className="section-number">03 / LIFESTYLE</span>
                  <h2>Consider the comforts.</h2>
                </div>

                <span className="amenity-count">
                  {String(amenities.length).padStart(2, "0")}
                  <small> AMENITIES</small>
                </span>
              </div>

              {amenities.length > 0 ? (
                <div className="amenities-editorial-grid">
                  {amenities.map((amenity, index) => (
                    <div
                      className="amenity-editorial-item"
                      key={`${amenity}-${index}`}
                    >
                      <span className="amenity-check">✓</span>
                      <span>{amenity}</span>
                      <span className="amenity-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="amenities-empty">
                  <span>—</span>
                  <p>
                    No amenities have been listed. Ask the property
                    owner for additional details.
                  </p>
                </div>
              )}
            </section>

            {/* Location details */}
            <section className="editorial-section location-section">
              <div className="section-heading-row compact-heading">
                <div>
                  <span className="section-number">04 / LOCATION</span>
                  <h2>Find your place.</h2>
                </div>
              </div>

              <div className="location-information">
                <div className="location-icon">↗</div>

                <div>
                  <span className="location-overline">
                    PROPERTY ADDRESS
                  </span>

                  <h3>
                    {property.location || "Location not specified"}
                  </h3>

                  <p>{property.city || "City not specified"}</p>
                </div>
              </div>
            </section>
          </main>

          {/* Owner and enquiry sidebar */}
          <aside className="details-sidebar">
            <div className="owner-editorial-card">
              <div className="owner-card-topline">
                <span>DIRECT CONTACT</span>
                <span className="owner-online-dot" />
              </div>

              <span className="owner-card-label">
                THE PROPERTY CONTACT
              </span>

              <div className="owner-profile">
                <div className="owner-initial">
                  {(property.ownerName || "P")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>{property.ownerName || "Property Owner"}</h3>
                  <p>Property owner</p>
                </div>
              </div>

              <div className="owner-contact-divider" />

              <div className="owner-contact-detail">
                <span>PROPERTY</span>
                <strong>{property.title}</strong>
              </div>

              <div className="owner-contact-detail">
                <span>LOCATION</span>
                <strong>
                  {[property.location, property.city]
                    .filter(Boolean)
                    .join(", ") || "Not specified"}
                </strong>
              </div>

              <div className="owner-contact-detail">
                <span>ASKING PRICE</span>
                <strong>{formatPrice(property.price)}</strong>
              </div>

              <button
                type="button"
                className="owner-primary-action"
                onClick={() => setAiCallOpen(true)}
              >
                <span>Request an AI call</span>
                <span>↗</span>
              </button>

              <button
                type="button"
                className="owner-secondary-action"
                onClick={() => {
                  setShowEnquiry((previous) => !previous);
                  setEnquiryMessage("");
                }}
              >
                <span>
                  {showEnquiry
                    ? "Hide enquiry form"
                    : "Send an enquiry"}
                </span>
                <span>{showEnquiry ? "−" : "+"}</span>
              </button>

              <p className="owner-card-note">
                Have questions about the property? Send your details
                and message to start the conversation.
              </p>

              {showEnquiry && (
                <form
                  id="property-enquiry"
                  className="details-enquiry-form"
                  onSubmit={sendToWhatsApp}
                >
                  <div className="enquiry-form-heading">
                    <span>YOUR MESSAGE</span>
                    <h3>Let's talk property.</h3>
                  </div>

                  <label htmlFor="senderName">Full name *</label>
                  <input
                    id="senderName"
                    type="text"
                    name="senderName"
                    placeholder="Enter your name"
                    value={formData.senderName}
                    onChange={handleEnquiryChange}
                    required
                  />

                  <label htmlFor="senderPhone">Phone number *</label>
                  <input
                    id="senderPhone"
                    type="tel"
                    name="senderPhone"
                    placeholder="Enter your phone number"
                    value={formData.senderPhone}
                    onChange={handleEnquiryChange}
                    required
                  />

                  <label htmlFor="senderEmail">Email address</label>
                  <input
                    id="senderEmail"
                    type="email"
                    name="senderEmail"
                    placeholder="Enter your email"
                    value={formData.senderEmail}
                    onChange={handleEnquiryChange}
                  />

                  <label htmlFor="message">Your message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="I'd like to know more about this property..."
                    value={formData.message}
                    onChange={handleEnquiryChange}
                    required
                  />

                  {enquiryMessage && (
                    <div
                      className={
                        enquiryMessage
                          .toLowerCase()
                          .includes("successfully")
                          ? "details-enquiry-feedback success"
                          : "details-enquiry-feedback error"
                      }
                      role="status"
                    >
                      {enquiryMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="enquiry-submit-button"
                    disabled={enquiryLoading}
                  >
                    {enquiryLoading
                      ? "Sending enquiry..."
                      : "Save enquiry & open WhatsApp"}
                    {!enquiryLoading && <span>↗</span>}
                  </button>
                </form>
              )}
            </div>

            <div className="sidebar-note-card">
              <span className="sidebar-note-index">BB / NOTE</span>
              <p>
                A better property decision starts with the right
                questions.
              </p>
              <span className="sidebar-note-signature">
                BUILDERBROGET REALITY CHECK
              </span>
            </div>
          </aside>
        </div>

        {/* Nearby essentials */}
        <NearbyEssentials property={property} />

        {/* Home loan calculator */}
        <section className="details-extra-section loan-section">
          <div className="extra-section-heading">
            <span className="section-number">
              05 / PLAN YOUR PURCHASE
            </span>
            <h2>
              Know your numbers.
              <br />
              <span>Then make your move.</span>
            </h2>
          </div>

          <HomeLoanCalculator propertyPrice={property.price} />
        </section>

        {/* Similar properties */}
        {similarProperties.length > 0 && (
          <section className="similar-properties-section">
            <div className="similar-heading-row">
              <div>
                <span className="section-number">
                  06 / DISCOVER MORE
                </span>
                <h2>
                  Other places
                  <br />
                  <span>worth a look.</span>
                </h2>
              </div>

              <Link to="/" className="similar-view-all">
                Explore all properties <span>↗</span>
              </Link>
            </div>

            <div className="similar-properties-grid">
              {similarProperties.map((similarProperty) => (
                <PropertyCard
                  key={similarProperty._id}
                  property={similarProperty}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* AI call modal */}
      {aiCallOpen && (
        <AICallModal
          property={property}
          onClose={() => setAiCallOpen(false)}
        />
      )}

      {/* Vastu chatbot */}
      <VastuChatbot />
    </div>
  );
}

export default PropertyDetails;



