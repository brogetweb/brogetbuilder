import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import "./PropertyCard.css";

function PropertyCard({ property }) {
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkFavorite = async () => {
      const token = localStorage.getItem("token");

      if (!token || !property?._id) {
        setFavorite(false);
        return;
      }

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

    checkFavorite();

    return () => {
      cancelled = true;
    };
  }, [property?._id]);

  const toggleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add properties to your favourites.");
      navigate("/login");
      return;
    }

    if (loadingFavorite || !property?._id) return;

    setLoadingFavorite(true);

    try {
      if (favorite) {
        await axios.delete(
          `${API_URL}/favourites/${property._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

      alert(
        error.response?.data?.message ||
        "Unable to update favourites. Please try again."
      );
    } finally {
      setLoadingFavorite(false);
    }
  };

  if (!property) return null;

  const image =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85";

  const listingType = property.listingType || "Buy";

  const listingLabel =
    listingType.toLowerCase() === "buy"
      ? "FOR SALE"
      : listingType.toLowerCase() === "rent"
      ? "FOR RENT"
      : listingType.toUpperCase();

  const formattedPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return "Price on request";
    }

    const amount = Number(price);

    if (Number.isNaN(amount)) return price;

    if (amount >= 10000000) {
      return `₹${(amount / 10000000)
        .toFixed(2)
        .replace(/\.?0+$/, "")} Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000)
        .toFixed(2)
        .replace(/\.?0+$/, "")} Lac`;
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const propertyLink = `/property/${property._id}`;

  return (
    <article className="pc-card">
      <div className="pc-image-section">

        <Link
          to={propertyLink}
          className="pc-image-link"
          aria-label={`View ${property.title || "property"} details`}
        >
          <img
            src={image}
            alt={property.title || "Property"}
            className="pc-image"
            loading="lazy"
          />
        </Link>

        {property.featured && (
          <span className="pc-featured-label">
            FEATURED
          </span>
        )}

        <span className="pc-sale-bookmark">
          {listingLabel}
        </span>

        {/* <button
          type="button"
          className={`pc-favorite ${favorite ? "active" : ""}`}
          onClick={toggleFavorite}
          disabled={loadingFavorite}
          aria-label={
            favorite
              ? "Remove from favourites"
              : "Add to favourites"
          }
          title={
            favorite
              ? "Remove from favourites"
              : "Add to favourites"
          }
        >
          {loadingFavorite ? (
            <span className="pc-favorite-loader" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill={favorite ? "currentColor" : "none"}
              aria-hidden="true"
            >
              <path
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button> */}
      </div>

      <div className="pc-body">

        <div className="pc-top-row">
          <span className="pc-category">
            {property.propertyType || "Residential Property"}
          </span>
        </div>

        <Link
          to={propertyLink}
          className="pc-title-link"
        >
          <h3 className="pc-title">
            {property.title || "Untitled Property"}
          </h3>
        </Link>

        <div className="pc-location">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            <circle
              cx="12"
              cy="10"
              r="2.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>

          <span>
            {[property.location, property.city]
              .filter(Boolean)
              .join(", ") || "Location not specified"}
          </span>

        </div>

        <div className="pc-specifications">

          {property.bedrooms !== undefined &&
            property.bedrooms !== null &&
            property.bedrooms !== "" && (
              <span className="pc-spec">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 11V5h18v6M3 19v-8h18v8M3 15h18M5 19v2M19 19v2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {property.bedrooms} BHK
              </span>
            )}

          {property.bathrooms !== undefined &&
            property.bathrooms !== null &&
            property.bathrooms !== "" && (
              <span className="pc-spec">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4ZM6 12V6a3 3 0 0 1 6 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {property.bathrooms} Baths
              </span>
            )}

          {property.area !== undefined &&
            property.area !== null &&
            property.area !== "" && (
              <span className="pc-spec">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4h16v16H4zM4 10h6M10 4v6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {property.area} sq.ft.
              </span>
            )}

        </div>

        <div className="pc-price-section">

          <div className="pc-price-info">

            <span className="pc-price-caption">
              PRICE
            </span>

            <strong className="pc-price-value">
              {formattedPrice(property.price)}
            </strong>

          </div>

          <Link
            to={propertyLink}
            className="pc-view-details"
            aria-label="View property details"
          >
            View Details

            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

        </div>

      </div>

    </article>
  );
}

export default PropertyCard;

