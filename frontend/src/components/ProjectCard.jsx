import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./PropertyCard.css";

function ProjectCard({ project }) {
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkFavorite = async () => {
      const token = localStorage.getItem("token");

      if (!token || !project?._id) {
        setFavorite(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/favourites/check/${project._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setFavorite(Boolean(response.data.favourite));
        }
      } catch (error) {
        console.error("Error checking favourite:", error);
      }
    };

    checkFavorite();

    return () => {
      cancelled = true;
    };
  }, [project?._id]);

  // Prevent errors if no project object is passed.
  if (!project || typeof project !== "object") {
    return null;
  }

  const image =
    project.images?.[0] ||
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85";

  // Old project data fields
  const projectName = project.name || project.title || "Untitled Project";
  const builder = project.builder || "";
  const configurations = Array.isArray(project.configurations)
    ? project.configurations
    : [];
  const amenities = Array.isArray(project.amenities)
    ? project.amenities
    : [];

  const listingType = project.listingType || "Buy";

  const listingLabel =
    listingType.toLowerCase() === "buy"
      ? "FOR SALE"
      : listingType.toLowerCase() === "rent"
      ? "FOR RENT"
      : listingType.toUpperCase();

  // Format project prices
  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return null;
    }

    const amount = Number(price);

    if (Number.isNaN(amount)) {
      return String(price);
    }

    if (amount >= 10000000) {
      return `${(amount / 10000000)
        .toFixed(2)
        .replace(/\.?0+$/, "")} Cr`;
    }

    if (amount >= 100000) {
      return `${(amount / 100000)
        .toFixed(2)
        .replace(/\.?0+$/, "")} Lac`;
    }

    return amount.toLocaleString("en-IN");
  };

  const minPrice = formatPrice(project.minPrice);
  const maxPrice = formatPrice(project.maxPrice);

  const priceRange =
    minPrice && maxPrice
      ? `${minPrice} - ${maxPrice}`
      : minPrice
      ? `From ${minPrice}`
      : maxPrice
      ? `Up to ${maxPrice}`
      : "Price on request";

  // Add or remove favourite
  const toggleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add projects to your favourites.");
      navigate("/login");
      return;
    }

    if (loadingFavorite) return;

    setLoadingFavorite(true);

    try {
      if (favorite) {
        await axios.delete(
          `${API_URL}/favourites/${project._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavorite(false);
      } else {
        await axios.post(
          `${API_URL}/favourites/${project._id}`,
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

  return (
    <article className="pc-card">
      {/* Project image section */}
      <div className="pc-image-section">
        <Link
          to={`/project/${project._id}`}
          className="pc-image-link"
          aria-label={`View ${projectName} details`}
        >
          <img
            src={image}
            alt={projectName}
            className="pc-image"
            loading="lazy"
          />
        </Link>

        <div className="pc-image-shade" />

        {/* Project status from old data */}
        <div className="pc-sale-bookmark">
          {(project.status || "PROJECT").toUpperCase()}
        </div>

        {/* Verified badge */}
        {project.verified && (
          <span className="pc-verified-label">
            ✓ VERIFIED
          </span>
        )}

        {/* Featured badge */}
        {project.featured && (
          <span className="pc-featured-label">
            FEATURED
          </span>
        )}

        {/* Favourite button */}
        <button
          type="button"
          className={`pc-favorite ${
            favorite ? "pc-favorite-active" : ""
          }`}
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
        </button>

        {/* Floating price plate */}
        <div className="pc-price-plate">
          <span className="pc-price-caption">
            PRICE RANGE
          </span>

          <strong className="pc-price-value">
            {priceRange}
          </strong>

          <span className="pc-price-corner" />
        </div>
      </div>

      {/* Project information */}
      <div className="pc-body">
        
        {project.propertyType && (
          <div className="pc-category-line">
            <span className="pc-category">{project.propertyType}</span>
            <span className="pc-category-rule" />
          </div>
        )}

        {/* Project name */}
        <Link
          to={`/project/${project._id}`}
          className="pc-title-link"
        >
          <h3 className="pc-title">{projectName}</h3>
        </Link>

        {/* Location */}
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
            {[project.location, project.city]
              .filter(Boolean)
              .join(", ") || "Location not specified"}
          </span>
        </div>

        {/* Configurations or property type */}
        <div className="pc-project-configurations">
          <span className="pc-configuration-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 11 12 3l9 8M5 10v11h14V10M9 21v-7h6v7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span>
            {configurations.length > 0
              ? configurations.join(" • ")
              : project.propertyType || "Residential Project"}
          </span>
        </div>

        {/* Possession */}
        {project.possession && (
          <div className="pc-possession">
            <span className="pc-possession-label">
              POSSESSION
            </span>

            <strong className="pc-possession-value">
              {project.possession}
            </strong>
          </div>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="pc-amenities">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span
                className="pc-amenity"
                key={`${amenity}-${index}`}
              >
                {amenity}
              </span>
            ))}

            {amenities.length > 3 && (
              <span className="pc-amenity-more">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Architectural footer */}
      <div className="pc-footer">
        <div className="pc-footer-line">
          <span className="pc-footer-line-accent" />
        </div>

        <Link
          to={`/project/${project._id}`}
          className="pc-view-details"
        >
          <span className="pc-view-text">
            EXPLORE PROJECT
          </span>

          <span className="pc-view-arrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </article>
  );
}

export default ProjectCard;