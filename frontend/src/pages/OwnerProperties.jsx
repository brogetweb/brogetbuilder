
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../config";
// import PropertyCard from "../components/PropertyCard";

// function OwnerProperties() {
//   const { ownerId } = useParams();

//   const [owner, setOwner] = useState(null);
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOwnerProperties = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const response = await axios.get(
//           `${API_URL}/public/owners/${ownerId}/properties`
//         );

//         setOwner(response.data.owner);
//         setProperties(response.data.properties || []);
//       } catch (err) {
//         console.error("Error fetching owner properties:", err);
//         setError(
//           err.response?.data?.message ||
//             "Unable to load this owner's properties."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnerProperties();
//   }, [ownerId]);

//   if (loading) {
//     return (
//       <main className="owner-properties-page">
//         <p>Loading owner properties...</p>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="owner-properties-page">
//         <Link to="/" className="back-home-link">
//           ← Back to Home
//         </Link>
//         <h2>Something went wrong</h2>
//         <p>{error}</p>
//       </main>
//     );
//   }

//   return (
//     <main className="owner-properties-page">
//       <Link to="/" className="back-home-link">
//         ← Back to Home
//       </Link>

//       <section className="owner-profile-banner">
//         <div className="owner-profile-avatar">
//           {owner?.name?.charAt(0).toUpperCase() || "O"}
//         </div>

//         <div>
//           <span className="owner-profile-label">
//             PROPERTY COLLECTION
//           </span>

//           <h1>{owner?.name}</h1>

//           <p>
//             Explore properties listed by this registered owner.
//           </p>
//         </div>

//         <div className="owner-total">
//           <strong>{properties.length}</strong>
//           <span>
//             {properties.length === 1 ? "Property" : "Properties"}
//           </span>
//         </div>
//       </section>

//       <section className="owner-listings">
//         <div className="owner-listings-heading">
//           <div>
//             <h2>Properties by {owner?.name}</h2>
//             <p>Find a property that feels like home.</p>
//           </div>
//         </div>

//         {properties.length === 0 ? (
//           <div className="owner-empty-state">
//             <div className="empty-house">⌂</div>
//             <h3>No properties listed yet</h3>
//             <p>
//               This owner has not linked any properties to
//               their account yet.
//             </p>

//             <Link to="/" className="back-home-button">
//               Explore All Properties
//             </Link>
//           </div>
//         ) : (
//           <div className="properties-grid">
//             {properties.map((property) => (
//               <PropertyCard
//                 key={property._id}
//                 property={property}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// export default OwnerProperties;


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import PropertyCard from "../components/PropertyCard";

function OwnerProperties() {
  const { ownerId } = useParams();

  const [owner, setOwner] = useState(null);
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnerListings = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${API_URL}/public/owners/${ownerId}/properties`
        );

        setOwner(response.data.owner);
        setProperties(response.data.properties || []);
        setProjects(response.data.projects || []);
      } catch (err) {
        console.error("Error fetching owner listings:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load this owner's properties and projects."
        );
      } finally {
        setLoading(false);
      }
    };

    if (ownerId) {
      fetchOwnerListings();
    } else {
      setError("Owner ID is missing.");
      setLoading(false);
    }
  }, [ownerId]);

  if (loading) {
    return (
      <main className="owner-properties-page">
        <p>Loading owner listings...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="owner-properties-page">
        <Link to="/" className="back-home-link">
          ← Back to Home
        </Link>

        <h2>Unable to load listings</h2>
        <p>{error}</p>
      </main>
    );
  }

  const totalListings = properties.length + projects.length;

  // Adapt project fields for the existing PropertyCard.
  // Keep the original project ID for project details navigation.
  const formattedProjects = projects.map((project) => ({
    ...project,
    _id: project._id,
    name: project.name,
    title: project.name,
    propertyType: project.propertyType,
    location: project.location,
    city: project.city,
    price: project.minPrice,
    minPrice: project.minPrice,
    maxPrice: project.maxPrice,
    images: project.images || [],
    image:
      project.images?.[0] ||
      project.image ||
      "",
    listingType: "project",
    isProject: true,
  }));

  return (
    <main className="owner-properties-page">
      {/* Back Navigation */}
      <Link to="/" className="back-home-link">
        ← Back to Home
      </Link>

      {/* Owner Profile */}
      <section className="owner-profile-banner">
        <div className="owner-profile-avatar">
          {owner?.name?.charAt(0).toUpperCase() || "O"}
        </div>

        <div className="owner-profile-info">
          <span className="owner-profile-label">
            PROPERTY & PROJECT COLLECTION
          </span>

          <h1>{owner?.name || "Property Owner"}</h1>

          <p>
            Explore properties and real estate projects
            listed by this registered owner.
          </p>
        </div>

        <div className="owner-total">
          <strong>{totalListings}</strong>
          <span>
            {totalListings === 1 ? "Total Listing" : "Total Listings"}
          </span>
        </div>
      </section>

      {/* Listing Summary */}
      <section className="owner-listing-summary">
        <div className="owner-summary-card">
          <span className="owner-summary-icon">⌂</span>

          <div>
            <strong>{properties.length}</strong>
            <p>
              {properties.length === 1 ? "Property" : "Properties"}
            </p>
          </div>
        </div>

        <div className="owner-summary-card">
          <span className="owner-summary-icon">▦</span>

          <div>
            <strong>{projects.length}</strong>
            <p>
              {projects.length === 1 ? "Project" : "Projects"}
            </p>
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="owner-listings">
        <div className="owner-listings-heading">
          <div>
            <h2>Properties by {owner?.name}</h2>
            <p>Find a property that feels like home.</p>
          </div>

          <span className="owner-section-count">
            {properties.length}{" "}
            {properties.length === 1 ? "Property" : "Properties"}
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="owner-empty-state">
            <div className="empty-house">⌂</div>
            <h3>No properties listed yet</h3>
            <p>
              This owner has not listed any properties yet.
            </p>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                listingType="property"
              />
            ))}
          </div>
        )}
      </section>

      {/* Projects */}
      <section className="owner-listings owner-projects-section">
        <div className="owner-listings-heading">
          <div>
            <h2>Projects by {owner?.name}</h2>
            <p>
              Discover new launches, ongoing developments,
              and ready-to-move projects.
            </p>
          </div>

          <span className="owner-section-count">
            {projects.length}{" "}
            {projects.length === 1 ? "Project" : "Projects"}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="owner-empty-state">
            <div className="empty-house">▦</div>
            <h3>No projects listed yet</h3>
            <p>
              This owner has not published any projects yet.
            </p>
          </div>
        ) : (
<div className="projects-grid">
  {projects.map((project) => (
    <div className="project-card" key={project._id}>
      {/* PROJECT IMAGE */}
      <div className="project-image">
        <img
          src={
            project.images?.[0] ||
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000"
          }
          alt={project.name || "Residential project"}
        />

        <span className="project-status">
          {project.status}
        </span>

        {project.verified && (
          <span className="project-verified">
            ✓ Verified
          </span>
        )}
      </div>

      {/* PROJECT INFORMATION */}
      <div className="project-info">
        <p className="project-builder">
          {project.builder}
        </p>

        <h3>{project.name}</h3>

        <p className="project-location">
          📍 {project.location}
          {project.city ? `, ${project.city}` : ""}
        </p>

        <div className="project-type">
          🏠{" "}
          {project.configurations?.length
            ? project.configurations.join(" • ")
            : project.propertyType}
        </div>

        <div className="project-price">
          ₹
          {Number(project.minPrice || 0).toLocaleString("en-IN")}
          {" - "}
          ₹
          {Number(project.maxPrice || 0).toLocaleString("en-IN")}
        </div>

        <div className="project-possession">
          <span>Possession</span>
          <strong>
            {project.possession || "Not specified"}
          </strong>
        </div>

        <div className="project-amenities">
          {project.amenities?.slice(0, 3).map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </div>

        {/* REDIRECT TO PROJECT DETAILS */}
        <Link
          to={`/project/${project._id}`}
          className="view-project-btn"
        >
          View Project
        </Link>
      </div>
    </div>
  ))}
</div>
        )}
      </section>

      {/* Explore Listings */}
      {totalListings === 0 && (
        <div className="owner-empty-state owner-no-listings">
          <h3>No listings available</h3>
          <p>
            This owner has not published any properties or
            projects yet.
          </p>

          <Link to="/" className="back-home-button">
            Explore All Listings
          </Link>
        </div>
      )}
    </main>
  );
}

export default OwnerProperties;

  
