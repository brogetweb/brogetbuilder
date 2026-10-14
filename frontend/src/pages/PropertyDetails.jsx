
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

import PropertyCard from "../components/PropertyCard";
import HomeLoanCalculator from "../components/HomeLoanCalculator";

import AICallModal from "../components/AICallModal";

import VastuChatbot from "../components/VastuChatbot";
import NearbyEssentials from "../components/NearbyEssentials";



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


  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    message: ""
  });

  /* ==========================================
     RECORD PROPERTY VISIT
  ========================================== */

  const recordVisit = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");

      // Only logged-in registered users are recorded.
      if (!token) {
        return;
      }

      await axios.post(
        `${API_URL}/visits/${propertyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      // Visit tracking failure should not break the page.
      console.log("Visit tracking error:", error);
    }
  };

  /* ==========================================
     FETCH PROPERTY AND SIMILAR PROPERTIES
  ========================================== */

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

        if (
          propertyData.images &&
          propertyData.images.length > 0
        ) {
          setSelectedImage(propertyData.images[0]);
        }

        // Record the visit after successfully loading the property.
        recordVisit(propertyData._id);

        try {
          const similarResponse = await axios.get(
            `${API_URL}/properties/similar/${id}`
          );

          if (isActive) {
            setSimilarProperties(similarResponse.data);
          }
        } catch (error) {
          console.log("Similar properties error:", error);
        }
      } catch (error) {
        console.log("Fetch property error:", error);

        if (isActive) {
          setProperty(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    return () => {
      isActive = false;
    };
  }, [id]);

  /* ==========================================
     ENQUIRY FORM CHANGE
  ========================================== */

  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  /* ==========================================
     SEND ENQUIRY TO MONGODB + WHATSAPP
  ========================================== */

  const sendToWhatsApp = async (e) => {
    e.preventDefault();

    if (!property) {
      setEnquiryMessage(
        "Property details are not available."
      );
      return;
    }

    if (
      !formData.senderName.trim() ||
      !formData.senderPhone.trim() ||
      !formData.message.trim()
    ) {
      setEnquiryMessage(
        "Please fill all required fields."
      );
      return;
    }

    setEnquiryLoading(true);
    setEnquiryMessage("");

    try {
      // 1. Save enquiry in MongoDB.
      const enquiryResponse = await axios.post(
        `${API_URL}/enquiries`,
        {
          property: property._id,
          name: formData.senderName.trim(),
          phone: formData.senderPhone.trim(),
          email: formData.senderEmail.trim(),
          message: formData.message.trim()
        }
      );

      console.log(
        "Enquiry saved:",
        enquiryResponse.data
      );

      // 2. Get the owner's WhatsApp number.
      let ownerPhone = String(
        property.contactNumber || ""
      ).replace(/\D/g, "");

      // Handle common Indian phone-number formats.
      if (ownerPhone.startsWith("0091")) {
        ownerPhone = ownerPhone.slice(2);
      }

      if (ownerPhone.startsWith("0") && ownerPhone.length === 11) {
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
          message: ""
        });

        return;
      }

      // 3. Create the WhatsApp message.
      const whatsappMessage = `Hello ${property.ownerName},

I am interested in your property listed on HomeEstate.

Property: ${property.title}
Location: ${property.location}, ${property.city}
Price: ₹${Number(property.price).toLocaleString("en-IN")}
Listing Type: ${property.listingType}

My Details:
Name: ${formData.senderName}
Phone: ${formData.senderPhone}
Email: ${formData.senderEmail}

Enquiry:
${formData.message}

Please contact me regarding this property.

Thank you.
HomeEstate`;

      // 4. Open WhatsApp.
      const whatsappUrl =
        `https://wa.me/${ownerPhone}?text=${encodeURIComponent(
          whatsappMessage
        )}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      // 5. Show success message.
      setEnquiryMessage(
        "Enquiry saved successfully. Opening WhatsApp..."
      );

      // 6. Clear the form.
      setFormData({
        senderName: "",
        senderPhone: "",
        senderEmail: "",
        message: ""
      });
    } catch (error) {
      console.log("ENQUIRY ERROR:", error);
      console.log(
        "SERVER RESPONSE:",
        error.response?.data
      );

      setEnquiryMessage(
        error.response?.data?.message ||
          "Unable to save enquiry. Please try again."
      );
    } finally {
      setEnquiryLoading(false);
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="details-loading">
        Loading property...
      </div>
    );
  }

  /* ==========================================
     PROPERTY NOT FOUND
  ========================================== */

  if (!property) {
    return (
      <div className="details-error">
        <h2>Property not found</h2>

        <Link to="/">
          Go back Home
        </Link>
      </div>
    );
  }

  /* ==========================================
     PROPERTY IMAGES
  ========================================== */

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000"
        ];

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="details-page">

      {/* BREADCRUMB */}

      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{property.city}</span>
        <span>/</span>
        <span>{property.title}</span>
      </div>

      {/* IMAGE GALLERY */}

      <section className="property-gallery">
        <div className="main-property-image">
          <img
            src={selectedImage || images[0]}
            alt={property.title}
          />

          {property.featured && (
            <span className="gallery-featured">
              Featured
            </span>
          )}

          {property.verified && (
            <span className="gallery-verified">
              ✓ Verified
            </span>
          )}

          <button
            type="button"
            className="gallery-heart"
            aria-label={
              favorite
                ? "Remove from favourites"
                : "Add to favourites"
            }
            onClick={() => setFavorite(!favorite)}
          >
            {favorite ? "❤️" : "♡"}
          </button>
        </div>

        <div className="thumbnail-container">
          {images.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              className={
                selectedImage === image
                  ? "thumbnail active-thumbnail"
                  : "thumbnail"
              }
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`Property ${index + 1}`}
              />
            </button>
          ))}
        </div>

     
      </section>

      {/* MAIN PROPERTY DETAILS */}

      <section className="details-main">

        {/* LEFT SIDE */}

        <div className="details-left">

          {/* HEADING */}

          <div className="details-heading">
            <div>
              <span className="details-property-type">
                {property.propertyType}
              </span>

              <h1>{property.title}</h1>

              <p className="details-location">
                📍 {property.location}, {property.city}
              </p>
            </div>

            <div className="details-price">
              <h2>
                ₹
                {Number(property.price).toLocaleString(
                  "en-IN"
                )}
              </h2>

              <span>{property.listingType}</span>
            </div>
          </div>

          {/* PROPERTY FEATURES */}

          <div className="details-features">
            <div>
              <strong>🛏️ {property.bedrooms ?? 0}</strong>
              <span>Bedrooms</span>
            </div>

            <div>
              <strong>🛁 {property.bathrooms ?? 0}</strong>
              <span>Bathrooms</span>
            </div>

            <div>
              <strong>📐 {property.area}</strong>
              <span>Sq.ft</span>
            </div>

            <div>
              <strong>🛋️</strong>
              <span>{property.furnishing}</span>
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="details-section">
            <h2>About this Property</h2>
            <p>{property.description}</p>
          </div>

          {/* AMENITIES */}

          <div className="details-section">
            <h2>Amenities</h2>

            <div className="details-amenities">
              {property.amenities &&
              property.amenities.length > 0 ? (
                property.amenities.map(
                  (amenity, index) => (
                    <div
                      className="details-amenity"
                      key={`${amenity}-${index}`}
                    >
                      ✓ {amenity}
                    </div>
                  )
                )
              ) : (
                <p>No amenities listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* OWNER CARD */}

      
<aside className="owner-card">
  <h2>Interested in this property?</h2>

  <div className="owner-info">
    <div className="owner-avatar">👤</div>

    <div>
      <h3>{property.ownerName || "Property Owner"}</h3>
      <p>Property Owner</p>
    </div>
  </div>

  {/* AI CALL SECTION */}
  <div className="ai-contact-section">
    <h3>AI Property Assistant</h3>

    <p>
      Request an AI call to hear the details of this property.
    </p>

    <button
      type="button"
      className="contact-btn"
      onClick={() => setAiCallOpen(true)}
    >
      📞 Contact Now — AI Call
    </button>
  </div>

  {/* AI CALL MODAL - SEPARATE FROM ENQUIRY FORM */}
 

  {/* SEPARATOR */}
  <div className="owner-card-divider"></div>

  {/* SEND ENQUIRY SECTION */}
  <div className="send-enquiry-section">
    <h3>Send an Enquiry</h3>

    <p>
      Fill in your details to send your enquiry to the property owner.
    </p>

    <button
      type="button"
      className="enquiry-btn"
      onClick={() => {
        setShowEnquiry((previous) => !previous);
        setEnquiryMessage("");
      }}
    >
      💬 {showEnquiry ? "Hide Enquiry Form" : "Send Enquiry"}
    </button>

    {/* ENQUIRY FORM */}
    {showEnquiry && (
      <form
        className="enquiry-form"
        onSubmit={sendToWhatsApp}
      >
        <h3>Your Enquiry Details</h3>

        <input
          type="text"
          name="senderName"
          placeholder="Your Name"
          value={formData.senderName}
          onChange={handleEnquiryChange}
          required
        />

        <input
          type="tel"
          name="senderPhone"
          placeholder="Phone Number"
          value={formData.senderPhone}
          onChange={handleEnquiryChange}
          required
        />

        <input
          type="email"
          name="senderEmail"
          placeholder="Email Address"
          value={formData.senderEmail}
          onChange={handleEnquiryChange}
        />

        <textarea
          name="message"
          placeholder="I am interested in this property. Please contact me."
          rows={4}
          value={formData.message}
          onChange={handleEnquiryChange}
          required
        />

        {enquiryMessage && (
          <div
            className={
              enquiryMessage.toLowerCase().includes("successfully")
                ? "enquiry-success"
                : "enquiry-error"
            }
            role="status"
          >
            {enquiryMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={enquiryLoading}
        >
          {enquiryLoading
            ? "Sending..."
            : "Save Enquiry & Open WhatsApp"}
        </button>
      </form>
    )}
  </div>
</aside>
      </section>

      {/* ==========================================
          HOME LOAN BANNER + EMI CALCULATOR
          + ELIGIBILITY FORM
      ========================================== */}
<NearbyEssentials property={property} />
      <HomeLoanCalculator
        propertyPrice={property.price}
      />

      {/* SIMILAR PROPERTIES */}

      {similarProperties.length > 0 && (
        <section className="similar-section">
          <h2>Similar Properties</h2>

          <div className="property-grid">
            {similarProperties.map((similarProperty) => (
              <PropertyCard
                key={similarProperty._id}
                property={similarProperty}
              />
            ))}
          </div>
        </section>
      )}

       {aiCallOpen && property && (
    <AICallModal
      property={property}
      onClose={() => setAiCallOpen(false)}
    />
  )}

 
  {/* VASTU CHATBOT */}

<VastuChatbot />
    </div>
  );
}

export default PropertyDetails;