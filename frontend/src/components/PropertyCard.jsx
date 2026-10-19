import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./PropertyCard.css";

function PropertyCard({ property }) {
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const image =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";

  // Check login and favourite status
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setFavorite(false);
      return;
    }

    let cancelled = false;

    const checkFavourite = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/favourites/check/${property._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setFavorite(response.data.favourite);
        }
      } catch (error) {
        console.error("Error checking favourite:", error);
      }
    };

    checkFavourite();

    return () => {
      cancelled = true;
    };
  }, [property._id]);

  // Add or remove favourite
  const handleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login or register to add properties to favourites.");
      navigate("/login");
      return;
    }

    try {
      setLoadingFavorite(true);

      if (favorite) {
        await axios.delete(`${API_URL}/favourites/${property._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFavorite(false);
      } else {
        await axios.post(
          `${API_URL}/favourites/${property._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favourite:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingFavorite(false);
    }
  };

  // Map common amenity names to emojis
  const getAmenityEmoji = (amenity) => {
    const name = String(amenity).toLowerCase();

    const amenityEmojis = [
      { keywords: ["swimming", "pool"], emoji: "🏊" },
      { keywords: ["gym", "fitness"], emoji: "🏋️" },
      { keywords: ["garden", "park", "landscap"], emoji: "🌳" },
      { keywords: ["parking", "garage"], emoji: "🚗" },
      { keywords: ["security", "cctv"], emoji: "🔒" },
      { keywords: ["lift", "elevator"], emoji: "🛗" },
      { keywords: ["clubhouse", "club house"], emoji: "🏢" },
      { keywords: ["wifi", "internet"], emoji: "📶" },
      { keywords: ["playground", "children", "kids"], emoji: "🛝" },
      { keywords: ["balcony", "terrace"], emoji: "🌇" },
      { keywords: ["power backup", "generator"], emoji: "⚡" },
      { keywords: ["water", "supply"], emoji: "💧" },
      { keywords: ["air conditioning", "ac"], emoji: "❄️" },
      { keywords: ["furnished", "furniture"], emoji: "🛋️" },
      { keywords: ["cctv", "surveillance"], emoji: "📹" },
      { keywords: ["court", "sports", "tennis"], emoji: "🎾" },
      { keywords: ["temple", "prayer"], emoji: "🙏" },
      { keywords: ["school"], emoji: "🏫" },
      { keywords: ["hospital", "medical"], emoji: "🏥" },
      { keywords: ["road"], emoji: "🛣️" },
      { keywords: ["fire"], emoji: "🧯" },
      { keywords: ["solar"], emoji: "☀️" },
      { keywords: ["rainwater", "harvesting"], emoji: "🌧️" },
      { keywords: ["community hall"], emoji: "🎉" },
    ];

    const match = amenityEmojis.find(({ keywords }) =>
      keywords.some((keyword) => name.includes(keyword))
    );

    return match?.emoji || "✨";
  };

  const amenities = property.amenities || [];
  const displayAmenities = amenities.slice(0, 3);
  const extraAmenitiesCount = Math.max(0, amenities.length - 3);

  return (
    <div className="pc-card">
      {/* TOP IMAGE SECTION */}
      <div className="pc-image-container">
        <img
          src={image}
          alt={property.title || "Property"}
          className="pc-image"
          loading="lazy"
        />

        {/* Floating badges */}
        <div className="pc-top-bar">
          <div className="pc-badge pc-badge-sale">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>{property.listingType || "For Sale"}</span>
          </div>

          <button
            type="button"
            className={`pc-fav-btn ${favorite ? "active" : ""}`}
            onClick={handleFavourite}
            disabled={loadingFavorite}
            aria-label={
              favorite ? "Remove from favourites" : "Add to favourites"
            }
            aria-pressed={favorite}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={favorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* Glass price shelf */}
        <div className="pc-glass-price-shelf">
          <div className="pc-price-meta">
            <span className="pc-price-label">ASKING PRICE</span>
            <span className="pc-price-value">
              {property.price != null
                ? `₹${Number(property.price).toLocaleString("en-IN")}`
                : "Price on request"}
            </span>
          </div>

          {property.featured && (
            <div className="pc-featured-badge">
              <span>★</span> Featured
            </div>
          )}
        </div>
      </div>

      {/* MAIN CARD BODY */}
      <div className="pc-body">
        <div className="pc-meta-row">
          <div className="pc-property-type">
            <div className="pc-icon-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>

            <span>{property.propertyType || "Property"}</span>
          </div>

          <span className="pc-status-pill">
            {property.listingType || "For Sale"}
          </span>
        </div>

        {/* PROPERTY DETAILS */}
        <div className="pc-details-split">
          <div className="pc-left-details">
            <h3 className="pc-title">
              {property.title || "Untitled Property"}
            </h3>

            <p className="pc-location">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>

              <span>
                {[property.location, property.city]
                  .filter(Boolean)
                  .join(", ") || "Location not specified"}
              </span>
            </p>

            {/* PROPERTY SPECIFICATIONS */}
            <div className="pc-specs-row">
              <div className="pc-spec-item">
                <span className="pc-spec-icon">🛏️</span>
                <div className="pc-spec-text">
                  <strong>{property.bedrooms ?? "—"}</strong>
                  <small>BHK</small>
                </div>
              </div>

              <div className="pc-spec-divider" />

              <div className="pc-spec-item">
                <span className="pc-spec-icon">🛁</span>
                <div className="pc-spec-text">
                  <strong>{property.bathrooms ?? "—"}</strong>
                  <small>Bath</small>
                </div>
              </div>

              <div className="pc-spec-divider" />

              <div className="pc-spec-item">
                <span className="pc-spec-icon">📐</span>
                <div className="pc-spec-text">
                  <strong>{property.area ?? "—"}</strong>
                  <small>Sq.ft</small>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT-SIDE CALLOUT */}
          <div className="pc-right-callout">
            <span className="pc-leaf-icon">🍃</span>
            <p>Modern living with nature around you</p>
          </div>
        </div>

        {/* AMENITIES WITH EMOJIS */}
        <div className="pc-amenities-pill">
          {displayAmenities.length > 0 ? (
            displayAmenities.map((amenity, idx) => (
              <span key={`${amenity}-${idx}`} className="pc-amenity-tag">
                <span className="pc-amenity-emoji" aria-hidden="true">
                  {getAmenityEmoji(amenity)}
                </span>
                <span>{amenity}</span>
              </span>
            ))
          ) : (
            <span className="pc-amenity-tag">
              <span className="pc-amenity-emoji" aria-hidden="true">
                ✨
              </span>
              <span>Standard Facilities</span>
            </span>
          )}

          {extraAmenitiesCount > 0 && (
            <span className="pc-amenity-more">
              +{extraAmenitiesCount}
            </span>
          )}
        </div>
      </div>

      {/* CURVED VIEW DETAILS FOOTER */}
      <Link to={`/property/${property._id}`} className="pc-footer-action">
        <div className="pc-action-btn">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>

        <div className="pc-footer-text">
          <strong>View Details</strong>
          <small>Explore more about this property</small>
        </div>

        <span className="pc-footer-quote">
          Your Dream Home Awaits
        </span>
      </Link>
    </div>
  );
}

export default PropertyCard;