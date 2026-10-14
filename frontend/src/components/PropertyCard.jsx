import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function PropertyCard({ property }) {

  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] =
    useState(false);

  const image =
    property.images &&
    property.images.length > 0
      ? property.images[0]
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";


  // =====================================
  // CHECK LOGIN + FAVOURITE
  // =====================================

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const checkFavourite = async () => {

      try {

        const response = await axios.get(
          `${API_URL}/favourites/check/${property._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFavorite(response.data.favourite);

      } catch (error) {

        console.log(error);

      }

    };

    checkFavourite();

  }, [property._id]);


  // =====================================
  // HANDLE FAVOURITE
  // =====================================

  const handleFavourite = async () => {

    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {

      alert(
        "Please login or register to add properties to favourites."
      );

      navigate("/login");

      return;
    }

    try {

      setLoadingFavorite(true);

      if (favorite) {

        // REMOVE FAVOURITE

        await axios.delete(
          `${API_URL}/favourites/${property._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFavorite(false);

      } else {

        // ADD FAVOURITE

        await axios.post(
          `${API_URL}/favourites/${property._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFavorite(true);
      }

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoadingFavorite(false);

    }
  };


  return (
    <div className="property-card">

      {/* IMAGE */}

      <div className="property-image">

        <img
          src={image}
          alt={property.title}
        />


        {/* FAVORITE */}

        <button
          className="favorite-btn"
          onClick={handleFavourite}
          disabled={loadingFavorite}
        >
          {favorite ? "❤️" : "🤍"}
        </button>


        {/* FEATURED */}

        {property.featured && (
          <span className="featured-badge">
            Featured
          </span>
        )}


        {/* VERIFIED */}

        {property.verified && (
          <span className="verified-badge">
            ✓ Verified
          </span>
        )}

      </div>


      {/* INFORMATION */}

      <div className="property-info">

        <div className="property-top">

          <span className="property-type">
            {property.propertyType}
          </span>

          <span className="listing-type">
            {property.listingType}
          </span>

        </div>


        <h3>
          {property.title}
        </h3>


        <p className="location">
          📍 {property.location},{" "}
          {property.city}
        </p>


        <h2>
          ₹{property.price.toLocaleString("en-IN")}
        </h2>


        <div className="property-features">

          <span>
            🛏️ {property.bedrooms} BHK
          </span>

          <span>
            🛁 {property.bathrooms} Bath
          </span>

          <span>
            📐 {property.area} Sq.ft
          </span>

        </div>


        {/* AMENITIES */}

        <div className="card-amenities">

          {property.amenities &&
          property.amenities.length > 0 ? (

            property.amenities
              .slice(0, 3)
              .map((amenity, index) => (
                <span key={index}>
                  {amenity}
                </span>
              ))

          ) : (

            <span>
              No amenities added
            </span>

          )}

        </div>


        <Link
          to={`/property/${property._id}`}
          className="view-btn"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}

export default PropertyCard;