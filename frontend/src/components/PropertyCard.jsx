// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config";
// import "./PropertyCard.css";

// function PropertyCard({ property }) {
//   const navigate = useNavigate();

//   const [favorite, setFavorite] = useState(false);
//   const [loadingFavorite, setLoadingFavorite] = useState(false);

//   const image =
//     property.images && property.images.length > 0
//       ? property.images[0]
//       : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85";

//   const listingType = property.listingType || "Buy";

//   const listingLabel =
//     listingType.toLowerCase() === "buy"
//       ? "FOR SALE"
//       : listingType.toLowerCase() === "rent"
//       ? "FOR RENT"
//       : listingType.toUpperCase();

//   const formattedPrice = (price) => {
//     if (price === undefined || price === null || price === "") {
//       return "Price on request";
//     }

//     const amount = Number(price);

//     if (Number.isNaN(amount)) {
//       return price;
//     }

//     if (amount >= 10000000) {
//       return `₹${(amount / 10000000)
//         .toFixed(2)
//         .replace(/\.?0+$/, "")} Cr`;
//     }

//     if (amount >= 100000) {
//       return `₹${(amount / 100000)
//         .toFixed(2)
//         .replace(/\.?0+$/, "")} Lac`;
//     }

//     return `₹${amount.toLocaleString("en-IN")}`;
//   };

//   useEffect(() => {
//     const checkFavorite = async () => {
//       const token = localStorage.getItem("token");

//       if (!token || !property?._id) {
//         setFavorite(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${API_URL}/favourites/check/${property._id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setFavorite(response.data.favourite);
//       } catch (error) {
//         console.error("Error checking favourite:", error);
//       }
//     };

//     checkFavorite();
//   }, [property?._id]);

//   const toggleFavorite = async (event) => {
//     event.preventDefault();
//     event.stopPropagation();

//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login to add properties to your favourites.");
//       navigate("/login");
//       return;
//     }

//     if (loadingFavorite) return;

//     setLoadingFavorite(true);

//     try {
//       if (favorite) {
//         await axios.delete(
//           `${API_URL}/favourites/${property._id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setFavorite(false);
//       } else {
//         await axios.post(
//           `${API_URL}/favourites/${property._id}`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setFavorite(true);
//       }
//     } catch (error) {
//       console.error("Error updating favourite:", error);

//       alert(
//         error.response?.data?.message ||
//           "Unable to update favourites. Please try again."
//       );
//     } finally {
//       setLoadingFavorite(false);
//     }
//   };

//   const amenities = Array.isArray(property.amenities)
//     ? property.amenities
//     : [];

//   return (
//     <article className="pc-card">
//       {/* Property image section */}
//       <div className="pc-image-section">
//         <Link
//           to={`/property/${property._id}`}
//           className="pc-image-link"
//           aria-label={`View ${property.title || "property"} details`}
//         >
//           <img
//             src={image}
//             alt={property.title || "Property"}
//             className="pc-image"
//             loading="lazy"
//           />
//         </Link>

//         <div className="pc-image-shade" />


//         {/* Bookmark-style listing label */}
//         <div className="pc-sale-bookmark">
//           {listingLabel}
//         </div>

//         {/* Featured label */}
//         {property.featured && (
//           <span className="pc-featured-label">
//             FEATURED
//           </span>
//         )}

//         {/* Favourite button */}
//         <button
//           type="button"
//           className={`pc-favorite ${
//             favorite ? "pc-favorite-active" : ""
//           }`}
//           onClick={toggleFavorite}
//           disabled={loadingFavorite}
//           aria-label={
//             favorite
//               ? "Remove from favourites"
//               : "Add to favourites"
//           }
//           title={
//             favorite
//               ? "Remove from favourites"
//               : "Add to favourites"
//           }
//         >
//           {loadingFavorite ? (
//             <span className="pc-favorite-loader" />
//           ) : (
//             <svg
//               viewBox="0 0 24 24"
//               fill={favorite ? "currentColor" : "none"}
//               aria-hidden="true"
//             >
//               <path
//                 d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
//                 stroke="currentColor"
//                 strokeWidth="1.6"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           )}
//         </button>

//         {/* Floating price plate */}
//         <div className="pc-price-plate">
//           <span className="pc-price-caption">
//             ASKING PRICE
//           </span>

//           <strong className="pc-price-value">
//             {formattedPrice(property.price)}
//           </strong>

//           <span className="pc-price-corner" />
//         </div>
//       </div>

//       {/* Property information */}
//       <div className="pc-body">
//         <div className="pc-category-line">
//           <span className="pc-category">
//             {property.propertyType || "Residential Property"}
//           </span>

//           <span className="pc-category-rule" />
//         </div>

//         <Link
//           to={`/property/${property._id}`}
//           className="pc-title-link"
//         >
//           <h3 className="pc-title">
//             {property.title || "Untitled Property"}
//           </h3>
//         </Link>

//         {/* Property location */}
//         <div className="pc-location">
//           <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             aria-hidden="true"
//           >
//             <path
//               d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
//               stroke="currentColor"
//               strokeWidth="1.6"
//               strokeLinejoin="round"
//             />

//             <circle
//               cx="12"
//               cy="10"
//               r="2.5"
//               stroke="currentColor"
//               strokeWidth="1.6"
//             />
//           </svg>

//           <span>
//             {[property.location, property.city]
//               .filter(Boolean)
//               .join(", ") || "Location not specified"}
//           </span>
//         </div>

//         {/* Property specifications */}
//         <div className="pc-specifications">
//           {property.bedrooms !== undefined &&
//             property.bedrooms !== null &&
//             property.bedrooms !== "" && (
//               <div className="pc-spec">
//                 <span className="pc-spec-value">
//                   {property.bedrooms}
//                 </span>

//                 <span className="pc-spec-label">
//                   BEDROOMS
//                 </span>
//               </div>
//             )}

//             {property.balconies !== undefined &&
//   property.balconies !== null &&
//   property.balconies !== "" && (
//     <div className="pc-spec">
//       <span className="pc-spec-value">
//         {property.balconies}
//       </span>

//       <span className="pc-spec-label">
//         BALCONIES
//       </span>
//     </div>
//   )}

//           {property.area !== undefined &&
//             property.area !== null &&
//             property.area !== "" && (
//               <div className="pc-spec">
//                 <span className="pc-spec-value">
//                   {property.area}
//                 </span>

//                 <span className="pc-spec-label">
//                   AREA / SQ FT
//                 </span>
//               </div>
//             )}
//         </div>

//         {/* Amenities */}
//         {amenities.length > 0 && (
//           <div className="pc-amenities">
//             {amenities.slice(0, 3).map((amenity, index) => (
//               <span
//                 className="pc-amenity"
//                 key={`${amenity}-${index}`}
//               >
//                 {amenity}
//               </span>
//             ))}

//             {amenities.length > 3 && (
//               <span className="pc-amenity-more">
//                 +{amenities.length - 3}
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Architectural footer */}
//       <div className="pc-footer">
//         <div className="pc-footer-line">
//           <span className="pc-footer-line-accent" />
//         </div>

//         <Link
//           to={`/property/${property._id}`}
//           className="pc-view-details"
//         >
//           <span className="pc-view-text">
//             EXPLORE PROPERTY
//           </span>

//           <span className="pc-view-arrow">
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               aria-hidden="true"
//             >
//               <path
//                 d="M5 12h14M13 5l7 7-7 7"
//                 stroke="currentColor"
//                 strokeWidth="1.7"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </span>
//         </Link>
//       </div>
//     </article>
//   );
// }

// export default PropertyCard;



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

    if (Number.isNaN(amount)) {
      return price;
    }

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

    if (loadingFavorite) return;

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

  return (
    <article className="pc-card">
      {/* Property image */}
      <div className="pc-image-section">
        <Link
          to={`/property/${property._id}`}
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

        <span className="pc-sale-bookmark">
          {listingLabel}
        </span>

        {property.featured && (
          <span className="pc-featured-label">
            FEATURED
          </span>
        )}
      </div>

      {/* Main property information */}
      <div className="pc-body">
        <div className="pc-top-row">
          <span className="pc-category">
            {property.propertyType || "Residential Property"}
          </span>

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
        </div>

        <Link
          to={`/property/${property._id}`}
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

        {/* Price and essential specifications */}
        <div className="pc-price-section">
          <span className="pc-price-caption">PRICE</span>

          <strong className="pc-price-value">
            {formattedPrice(property.price)}
          </strong>
        </div>

        <div className="pc-specifications">
          {property.bedrooms !== undefined &&
            property.bedrooms !== null &&
            property.bedrooms !== "" && (
              <span className="pc-spec">
                <strong>{property.bedrooms}</strong>
                <span>BHK</span>
              </span>
            )}

          {property.area !== undefined &&
            property.area !== null &&
            property.area !== "" && (
              <span className="pc-spec">
                <strong>{property.area}</strong>
                <span>sq ft</span>
              </span>
            )}
        </div>

        {/* Property details link */}
        <div className="pc-footer">
          <Link
            to={`/property/${property._id}`}
            className="pc-view-details"
          >
            View Details
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
