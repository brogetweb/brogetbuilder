
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config";
// import "./PropertyCard.css";

// function ProjectCard({ project }) {
//   const navigate = useNavigate();

//   const [favorite, setFavorite] = useState(false);
//   const [loadingFavorite, setLoadingFavorite] = useState(false);

//   const projectId = project?._id;

//   const image =
//     project?.images?.[0] ||
//     "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85";

//   const projectName =
//     project?.name || project?.title || "Untitled Project";

//   const propertyType =
//     project?.propertyType || "Residential Project";

//   const status = project?.status || "Project";

//   const configurations = Array.isArray(project?.configurations)
//     ? project.configurations
//     : [];

//   const formatPrice = (price) => {
//     if (price === undefined || price === null || price === "") {
//       return null;
//     }

//     const amount = Number(price);

//     if (Number.isNaN(amount)) {
//       return String(price);
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

//   const minPrice = formatPrice(project?.minPrice);
//   const maxPrice = formatPrice(project?.maxPrice);

//   const priceRange =
//     minPrice && maxPrice
//       ? minPrice === maxPrice
//         ? minPrice
//         : `${minPrice} - ${maxPrice}`
//       : minPrice
//       ? `From ${minPrice}`
//       : maxPrice
//       ? `Up to ${maxPrice}`
//       : "Price on request";

//   useEffect(() => {
//     let cancelled = false;

//     const checkFavorite = async () => {
//       const token = localStorage.getItem("token");

//       if (!token || !projectId) {
//         setFavorite(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${API_URL}/favourites/check/${projectId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!cancelled) {
//           setFavorite(Boolean(response.data.favourite));
//         }
//       } catch (error) {
//         console.error("Error checking project favourite:", error);
//       }
//     };

//     checkFavorite();

//     return () => {
//       cancelled = true;
//     };
//   }, [projectId]);

//   const toggleFavorite = async (event) => {
//     event.preventDefault();
//     event.stopPropagation();

//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login to add projects to your favourites.");
//       navigate("/login");
//       return;
//     }

//     if (loadingFavorite || !projectId) return;

//     setLoadingFavorite(true);

//     try {
//       if (favorite) {
//         await axios.delete(
//           `${API_URL}/favourites/${projectId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setFavorite(false);
//       } else {
//         await axios.post(
//           `${API_URL}/favourites/${projectId}`,
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
//       console.error("Error updating project favourite:", error);

//       alert(
//         error.response?.data?.message ||
//           "Unable to update favourites. Please try again."
//       );
//     } finally {
//       setLoadingFavorite(false);
//     }
//   };

//   if (!project || typeof project !== "object") {
//     return null;
//   }

//   return (
//     <article className="pc-card">

//       <div className="pc-image-section">
//         <Link
//           to={`/project/${projectId}`}
//           className="pc-image-link"
//           aria-label={`View ${projectName} details`}
//         >
//           <img
//             src={image}
//             alt={projectName}
//             className="pc-image"
//             loading="lazy"
//           />
//         </Link>

//         <span className="pc-sale-bookmark">
//           {String(status).toUpperCase()}
//         </span>

//         {project.featured && (
//           <span className="pc-featured-label">
//             FEATURED
//           </span>
//         )}
//       </div>

//       <div className="pc-body">
//          <div className="pc-top-row">
//           <span className="pc-category">
//             {propertyType}
//           </span>

//           <button
//             type="button"
//             className={`pc-favorite ${
//               favorite ? "active" : ""
//             }`}
//             onClick={toggleFavorite}
//             disabled={loadingFavorite}
//             aria-label={
//               favorite
//                 ? "Remove from favourites"
//                 : "Add to favourites"
//             }
//             title={
//               favorite
//                 ? "Remove from favourites"
//                 : "Add to favourites"
//             }
//           >
//             {loadingFavorite ? (
//               <span className="pc-favorite-loader" />
//             ) : (
//               <svg
//                 viewBox="0 0 24 24"
//                 fill={favorite ? "currentColor" : "none"}
//                 aria-hidden="true"
//               >
//                 <path
//                   d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
//                   stroke="currentColor"
//                   strokeWidth="1.6"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             )}
//           </button>
//         </div>

//         <Link
//           to={`/project/${projectId}`}
//           className="pc-title-link"
//         >
//           <h3 className="pc-title">
//             {projectName}
//           </h3>
//         </Link>

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
//             {[project.location, project.city]
//               .filter(Boolean)
//               .join(", ") || "Location not specified"}
//           </span>
//         </div>

//         <div className="pc-specifications">
//           {configurations.length > 0 ? (
//             <span className="pc-spec">
//               <strong>
//                 {configurations.join(", ")}
//               </strong>
//             </span>
//           ) : (
//             <span className="pc-spec">
//               <strong>{propertyType}</strong>
//             </span>
//           )}

//           {project.possession && (
//             <span className="pc-spec">
//               <strong>{project.possession}</strong>
//               <span>Possession</span>
//             </span>
//           )}
//         </div>

//         <div className="pc-price-section">
//           <div className="pc-price-info">
//             <span className="pc-price-caption">
//               PRICE RANGE
//             </span>

//             <strong className="pc-price-value">
//               {priceRange}
//             </strong>
//           </div>

//           <Link
//             to={`/project/${projectId}`}
//             className="pc-view-details"
//             aria-label={`View ${projectName} details`}
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               aria-hidden="true"
//             >
//               <path
//                 d="M5 12h14M13 6l6 6-6 6"
//                 stroke="currentColor"
//                 strokeWidth="1.7"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </Link>
//         </div>

//       </div>
//     </article>
//   );
// }

// export default ProjectCard;


import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./PropertyCard.css";

function ProjectCard({ project }) {
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const projectId = project?._id;

  if (!project || typeof project !== "object") {
    return null;
  }

  const image =
    project.images?.length > 0
      ? project.images[0]
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85";

  const projectName =
    project.name || project.title || "Untitled Project";

  const propertyType =
    project.propertyType || "Residential Project";

  const status = project.status || "Project";

  const configurations = Array.isArray(project.configurations)
    ? project.configurations
    : [];

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return null;
    }

    const amount = Number(price);

    if (Number.isNaN(amount)) {
      return String(price);
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

  const minPrice = formatPrice(project.minPrice);
  const maxPrice = formatPrice(project.maxPrice);

  const priceRange =
    minPrice && maxPrice
      ? minPrice === maxPrice
        ? minPrice
        : `${minPrice} - ${maxPrice}`
      : minPrice
      ? `From ${minPrice}`
      : maxPrice
      ? `Up to ${maxPrice}`
      : "Price on request";

  const projectLink = `/project/${projectId}`;

  useEffect(() => {
    let cancelled = false;

    const checkFavorite = async () => {
      const token = localStorage.getItem("token");

      if (!token || !projectId) {
        setFavorite(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/favourites/check/${projectId}`,
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
        console.error("Error checking project favourite:", error);
      }
    };

    checkFavorite();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const toggleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add projects to your favourites.");
      navigate("/login");
      return;
    }

    if (loadingFavorite || !projectId) return;

    setLoadingFavorite(true);

    try {
      if (favorite) {
        await axios.delete(
          `${API_URL}/favourites/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavorite(false);
      } else {
        await axios.post(
          `${API_URL}/favourites/${projectId}`,
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
      console.error("Error updating project favourite:", error);

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

      {/* IMAGE SECTION */}
      <div className="pc-image-section">

        <Link
          to={projectLink}
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

        {project.featured && (
          <span className="pc-featured-label">
            FEATURED
          </span>
        )}

        <span className="pc-sale-bookmark">
          {String(status).toUpperCase()}
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
            {propertyType}
          </span>
        </div>

        <Link
          to={projectLink}
          className="pc-title-link"
        >
          <h3 className="pc-title">
            {projectName}
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
            {[project.location, project.city]
              .filter(Boolean)
              .join(", ") || "Location not specified"}
          </span>
        </div>

        <div className="pc-specifications">
          {configurations.length > 0 ? (
            <span className="pc-spec">
              <strong>
                {configurations.join(", ")}
              </strong>
            </span>
          ) : (
            <span className="pc-spec">
              <strong>{propertyType}</strong>
            </span>
          )}

          {project.possession && (
            <span className="pc-spec">
              <strong>{project.possession}</strong>
              <span>Possession</span>
            </span>
          )}
        </div>

        <div className="pc-price-section">
          <div className="pc-price-info">
            <span className="pc-price-caption">
              PRICE RANGE
            </span>

            <strong className="pc-price-value">
              {priceRange}
            </strong>
          </div>

          <Link
            to={projectLink}
            className="pc-view-details"
            aria-label={`View ${projectName} details`}
          >
            View Details
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
          </Link>
        </div>

      </div>
    </article>
  );
}

export default ProjectCard;
