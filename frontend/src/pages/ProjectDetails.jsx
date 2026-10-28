// import { useEffect, useState } from "react";
// import {
//   Link,
//   useParams
// } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../config";

// function ProjectDetails() {
//   const { id } = useParams();

//   const [project, setProject] =
//     useState(null);

//   const [selectedImage, setSelectedImage] =
//     useState("");

//   const [loading, setLoading] =
//     useState(true);


//   useEffect(() => {

//     const fetchProject = async () => {

//       try {

//         setLoading(true);

//         const response =
//           await axios.get(
//             `${API_URL}/projects/${id}`
//           );

//         const projectData =
//           response.data;

//         setProject(projectData);

//         if (
//           projectData.images &&
//           projectData.images.length > 0
//         ) {

//           setSelectedImage(
//             projectData.images[0]
//           );

//         }

//       } catch (error) {

//         console.log(error);

//       } finally {

//         setLoading(false);

//       }

//     };

//     fetchProject();

//   }, [id]);


//   if (loading) {

//     return (
//       <div className="details-loading">
//         Loading project...
//       </div>
//     );

//   }


//   if (!project) {

//     return (
//       <div className="details-error">

//         <h2>
//           Project not found
//         </h2>

//         <Link to="/new-projects">
//           Go Back to Projects
//         </Link>

//       </div>
//     );

//   }


//   const images =
//     project.images &&
//     project.images.length > 0
//       ? project.images
//       : [
//           "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000"
//         ];


//   return (
//     <div className="project-details-page">

//       {/* BREADCRUMB */}

//       <div className="breadcrumb">

//         <Link to="/">
//           Home
//         </Link>

//         <span>/</span>

//         <Link to="/new-projects">
//           New Projects
//         </Link>

//         <span>/</span>

//         <span>
//           {project.name}
//         </span>

//       </div>


//       {/* GALLERY */}

//       <section className="project-details-gallery">

//         <div className="project-main-image">

//           <img
//             src={selectedImage}
//             alt={project.name}
//           />


//           <span className="project-detail-status">
//             {project.status}
//           </span>


//           {project.verified && (
//             <span className="project-detail-verified">
//               ✓ Verified
//             </span>
//           )}

//         </div>


//         <div className="project-thumbnails">

//           {images.map(
//             (image, index) => (

//               <button
//                 key={index}
//                 className={
//                   selectedImage === image
//                     ? "project-thumbnail active"
//                     : "project-thumbnail"
//                 }
//                 onClick={() =>
//                   setSelectedImage(
//                     image
//                   )
//                 }
//               >

//                 <img
//                   src={image}
//                   alt={
//                     `Project ${index + 1}`
//                   }
//                 />

//               </button>

//             )
//           )}

//         </div>

//       </section>


//       {/* PROJECT CONTENT */}

//       <section className="project-details-main">

//         <div className="project-details-left">

//           <p className="project-builder">
//             {project.builder}
//           </p>


//           <h1>
//             {project.name}
//           </h1>


//           <p className="project-location">
//             📍 {project.location},{" "}
//             {project.city}
//           </p>


//           {/* PRICE */}

//           <div className="project-detail-price">

//             <h2>

//               ₹
//               {project.minPrice.toLocaleString(
//                 "en-IN"
//               )}

//               {" - "}

//               ₹
//               {project.maxPrice.toLocaleString(
//                 "en-IN"
//               )}

//             </h2>

//             <span>
//               Price Range
//             </span>

//           </div>


//           {/* CONFIGURATIONS */}

//           <div className="project-detail-box">

//             <h2>
//               Configurations
//             </h2>


//             <div className="configuration-list">

//               {project.configurations.map(
//                 (configuration) => (

//                   <div
//                     key={configuration}
//                   >
//                     🏠 {configuration}
//                   </div>

//                 )
//               )}

//             </div>

//           </div>


//           {/* PROJECT INFORMATION */}

//           <div className="project-detail-box">

//             <h2>
//               Project Information
//             </h2>


//             <div className="project-information-grid">

//               <div>

//                 <span>
//                   Property Type
//                 </span>

//                 <strong>
//                   {project.propertyType}
//                 </strong>

//               </div>


//               <div>

//                 <span>
//                   Area
//                 </span>

//                 <strong>
//                   {project.area}
//                 </strong>

//               </div>


//               <div>

//                 <span>
//                   Status
//                 </span>

//                 <strong>
//                   {project.status}
//                 </strong>

//               </div>


//               <div>

//                 <span>
//                   Possession
//                 </span>

//                 <strong>
//                   {project.possession}
//                 </strong>

//               </div>

//             </div>

//           </div>


//           {/* DESCRIPTION */}

//           <div className="project-detail-box">

//             <h2>
//               About this Project
//             </h2>

//             <p className="project-description">
//               {project.description}
//             </p>

//           </div>


//           {/* AMENITIES */}

//           <div className="project-detail-box">

//             <h2>
//               Amenities
//             </h2>


//             <div className="project-detail-amenities">

//               {project.amenities.map(
//                 (amenity) => (

//                   <div
//                     key={amenity}
//                   >
//                     ✓ {amenity}
//                   </div>

//                 )
//               )}

//             </div>

//           </div>

//         </div>


//         {/* BUILDER CARD */}

//         <aside className="project-builder-card">

//           <h2>
//             Interested in this Project?
//           </h2>


//           <div className="builder-profile">

//             <div className="builder-avatar">
//               🏢
//             </div>


//             <div>

//               <h3>
//                 {project.contactName}
//               </h3>

//               <p>
//                 Project Developer
//               </p>

//             </div>

//           </div>


//           <a
//             href={`tel:${project.contactNumber}`}
//             className="project-contact-btn"
//           >
//             📞 Contact Builder
//           </a>


//           <a
//             href={`tel:${project.contactNumber}`}
//             className="project-enquiry-btn"
//           >
//             💬 Send Enquiry
//           </a>

//         </aside>

//       </section>

//     </div>
//   );
// }

// export default ProjectDetails;


//new theme 
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../config";
// import VastuChatbot from "../components/VastuChatbot";
// import NearbyEssentials from "../components/NearbyEssentials";


// function ProjectDetails() {
//   const { id } = useParams();

//   const [project, setProject] = useState(null);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isActive = true;

//     const fetchProject = async () => {
//       try {
//         setLoading(true);
//         setProject(null);
//         setSelectedImage("");

//         const response = await axios.get(
//           `${API_URL}/projects/${id}`
//         );

//         if (!isActive) return;

//         const projectData = response.data;

//         setProject(projectData);

//         if (projectData.images?.length > 0) {
//           setSelectedImage(projectData.images[0]);
//         }
//       } catch (error) {
//         console.error("Fetch project error:", error);

//         if (isActive) {
//           setProject(null);
//         }
//       } finally {
//         if (isActive) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchProject();

//     return () => {
//       isActive = false;
//     };
//   }, [id]);

//   const formatPrice = (price) => {
//     if (price === undefined || price === null || price === "") {
//       return null;
//     }

//     return `₹${Number(price).toLocaleString("en-IN")}`;
//   };

//   if (loading) {
//     return (
//       <div className="details-loading">
//         Loading project...
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="details-error">
//         <h2>Project not found</h2>

//         <Link
//           to="/new-projects"
//           className="details-back-home"
//         >
//           Go Back to Projects
//         </Link>
//       </div>
//     );
//   }

//   const images =
//     project.images?.length > 0
//       ? project.images
//       : [
//           "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000",
//         ];

//   const configurations = Array.isArray(project.configurations)
//     ? project.configurations
//     : [];

//   const amenities = Array.isArray(project.amenities)
//     ? project.amenities
//     : [];

//   const minPrice = formatPrice(project.minPrice);
//   const maxPrice = formatPrice(project.maxPrice);

//   let priceRange = "Price on request";

//   if (minPrice && maxPrice) {
//     priceRange = `${minPrice} - ${maxPrice}`;
//   } else if (minPrice) {
//     priceRange = `Starting from ${minPrice}`;
//   } else if (maxPrice) {
//     priceRange = `Up to ${maxPrice}`;
//   }

//   const contactNumber = project.contactNumber || "";

//   const currentImageIndex = Math.max(
//     0,
//     images.findIndex(
//       (image) => image === (selectedImage || images[0])
//     )
//   );

//   return (
//     <div className="details-page">
//       <div className="details-container">
//         {/* BREADCRUMB */}
//         <div className="details-breadcrumb">
//           <Link to="/">Home</Link>

//           <span className="breadcrumb-divider">/</span>

//           <Link to="/new-projects">New Projects</Link>

//           <span className="breadcrumb-divider">/</span>

//           <span className="breadcrumb-current">
//             {project.name}
//           </span>
//         </div>

//         {/* PROJECT GALLERY */}
//         <section className="details-gallery-layout">
//           <div className="details-gallery-main">
//             <img
//               src={selectedImage || images[0]}
//               alt={project.name}
//             />

//             <div className="property-status-row">
//               <span className="property-status">
//                 <span className="status-dot" />
//                 {project.status || "Project"}
//               </span>

//               {project.verified && (
//                 <span className="property-verified-label">
//                   ✓ Verified
//                 </span>
//               )}
//             </div>

//             <span className="gallery-image-count">
//               {currentImageIndex + 1} / {images.length}
//             </span>
//           </div>

//           {images.length > 1 && (
//             <div className="details-gallery-thumbnails">
//               {images.map((image, index) => (
//                 <button
//                   type="button"
//                   key={`${image}-${index}`}
//                   className={`details-thumbnail ${
//                     (selectedImage || images[0]) === image
//                       ? "details-thumbnail-active"
//                       : ""
//                   }`}
//                   onClick={() => setSelectedImage(image)}
//                   aria-label={`View project image ${index + 1}`}
//                 >
//                   <img
//                     src={image}
//                     alt={`${project.name} ${index + 1}`}
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* PROJECT INTRODUCTION */}
//         <section className="property-intro">
//           <div className="property-intro-copy">
//             <div className="property-eyebrow">
//               <span className="eyebrow-line" />
//               <span className="eyebrow-number">01</span>
//               PROJECT OVERVIEW
//             </div>

//             <h1 className="property-editorial-title">
//               {project.name}
//               <span className="title-period">.</span>
//             </h1>

//             <p className="property-address">
//               <span className="address-symbol">⌖</span>
//               {[project.location, project.city]
//                 .filter(Boolean)
//                 .join(", ") || "Location not specified"}
//             </p>

//             <div className="property-status-row">
//               {project.builder && (
//                 <span className="property-type-label">
//                   {project.builder}
//                 </span>
//               )}

//               {project.propertyType && (
//                 <span className="property-type-label">
//                   {project.propertyType}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* PROJECT PRICE */}
//           <div className="property-price-panel">
//             <span className="price-panel-label">
//               PROJECT PRICE RANGE
//             </span>

//             <h2 className="property-price-value">
//               {priceRange}
//             </h2>

//             <div className="price-panel-rule" />

//             <div className="price-panel-bottom">
//               <span>Project Investment</span>
//               <span>INR</span>
//             </div>
//           </div>
//         </section>

//         {/* PROJECT FACTS */}
//         <section className="property-facts-section">
//           <div className="section-kicker">
//             PROJECT DETAILS
//           </div>

//           <div className="property-facts-grid">
//             <div className="property-fact">
//               <span className="fact-index">01</span>

//               <div className="fact-content">
//                 <span>Property Type</span>
//                 <strong>
//                   {project.propertyType || "Not specified"}
//                 </strong>
//               </div>

//               <span className="fact-arrow">↗</span>
//             </div>

//             <div className="property-fact">
//               <span className="fact-index">02</span>

//               <div className="fact-content">
//                 <span>Project Status</span>
//                 <strong>
//                   {project.status || "Not specified"}
//                 </strong>
//               </div>

//               <span className="fact-arrow">↗</span>
//             </div>

//             <div className="property-fact">
//               <span className="fact-index">03</span>

//               <div className="fact-content">
//                 <span>Project Area</span>
//                 <strong>
//                   {project.area || "Not specified"}
//                 </strong>
//               </div>

//               <span className="fact-arrow">↗</span>
//             </div>

//             <div className="property-fact">
//               <span className="fact-index">04</span>

//               <div className="fact-content">
//                 <span>Possession</span>
//                 <strong>
//                   {project.possession || "To be announced"}
//                 </strong>
//               </div>

//               <span className="fact-arrow">↗</span>
//             </div>
//           </div>
//         </section>

//         {/* MAIN CONTENT AND BUILDER SIDEBAR */}
//         <section className="details-content-layout">
//           <div className="details-content-main">
//             {/* CONFIGURATIONS */}
//             <section className="editorial-section">
//               <div className="section-heading-row">
//                 <div>
//                   <span className="section-number">01</span>
//                   <h2>Available Configurations</h2>
//                 </div>

//                 <span className="section-mark">⌂</span>
//               </div>

//               {configurations.length > 0 ? (
//                 <div className="specification-list">
//                   {configurations.map((configuration, index) => (
//                     <div
//                       className="specification-row"
//                       key={`${configuration}-${index}`}
//                     >
//                       <span className="specification-label">
//                         Configuration{" "}
//                         {String(index + 1).padStart(2, "0")}
//                       </span>

//                       <strong>{configuration}</strong>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="description-copy">
//                   Configuration details are not available yet.
//                 </p>
//               )}
//             </section>

//             {/* PROJECT INFORMATION */}
//             <section className="editorial-section">
//               <div className="section-heading-row">
//                 <div>
//                   <span className="section-number">02</span>
//                   <h2>Project Information</h2>
//                 </div>

//                 <span className="section-mark">↗</span>
//               </div>

//               <div className="specification-list">
//                 <div className="specification-row">
//                   <span className="specification-label">
//                     Project Name
//                   </span>
//                   <strong>{project.name}</strong>
//                 </div>

//                 <div className="specification-row">
//                   <span className="specification-label">
//                     Builder / Developer
//                   </span>
//                   <strong>
//                     {project.builder || "Not specified"}
//                   </strong>
//                 </div>

//                 <div className="specification-row">
//                   <span className="specification-label">
//                     Location
//                   </span>
//                   <strong>
//                     {[project.location, project.city]
//                       .filter(Boolean)
//                       .join(", ") || "Not specified"}
//                   </strong>
//                 </div>

//                 <div className="specification-row">
//                   <span className="specification-label">
//                     Property Type
//                   </span>
//                   <strong>
//                     {project.propertyType || "Not specified"}
//                   </strong>
//                 </div>

//                 <div className="specification-row">
//                   <span className="specification-label">
//                     Possession
//                   </span>
//                   <strong>
//                     {project.possession || "To be announced"}
//                   </strong>
//                 </div>

//                 <div className="specification-row">
//                   <span className="specification-label">
//                     Price Range
//                   </span>
//                   <strong>{priceRange}</strong>
//                 </div>
//               </div>
//             </section>

//             {/* ABOUT PROJECT */}
//             <section className="editorial-section description-section">
//               <div className="section-heading-row">
//                 <div>
//                   <span className="section-number">03</span>
//                   <h2>About This Project</h2>
//                 </div>

//                 <span className="section-mark">✳</span>
//               </div>

//               <div className="description-copy">
//                 <p>
//                   {project.description ||
//                     "More information about this project will be available soon."}
//                 </p>
//               </div>
//             </section>

//             {/* AMENITIES */}
//             <section className="editorial-section amenities-section">
//               <div className="section-heading-row">
//                 <div>
//                   <span className="section-number">04</span>
//                   <h2>Project Amenities</h2>
//                 </div>

//                 <span className="amenity-count">
//                   {String(amenities.length).padStart(2, "0")} ITEMS
//                 </span>
//               </div>

//               {amenities.length > 0 ? (
//                 <div className="amenities-editorial-grid">
//                   {amenities.map((amenity, index) => (
//                     <div
//                       className="amenity-editorial-item"
//                       key={`${amenity}-${index}`}
//                     >
//                       <span className="amenity-check">✓</span>

//                       <span className="amenity-index">
//                         {String(index + 1).padStart(2, "0")}
//                       </span>

//                       <span>{amenity}</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="amenities-empty">
//                   Amenities have not been added yet.
//                 </div>
//               )}
//             </section>

//             {/* LOCATION */}
//             <section className="editorial-section location-section">
//               <div className="section-heading-row">
//                 <div>
//                   <span className="section-number">05</span>
//                   <h2>Project Location</h2>
//                 </div>

//                 <span className="section-mark">⌖</span>
//               </div>

//               <div className="location-information">
//                 <span className="location-icon">⌖</span>

//                 <div>
//                   <span className="location-overline">
//                     PROJECT ADDRESS
//                   </span>

//                   <p>
//                     {[project.location, project.city]
//                       .filter(Boolean)
//                       .join(", ") || "Location not specified"}
//                   </p>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* BUILDER SIDEBAR */}
//           <aside className="details-sidebar">
//             <div className="owner-editorial-card">
//               <div className="owner-card-topline">
//                 <span className="owner-online-dot" />

//                 <span className="owner-card-label">
//                   PROJECT ENQUIRY
//                 </span>
//               </div>

//               <div className="owner-profile">
//                 <div className="owner-initial">
//                   {(
//                     project.contactName ||
//                     project.builder ||
//                     "B"
//                   )
//                     .charAt(0)
//                     .toUpperCase()}
//                 </div>

//                 <div>
//                   <h3>
//                     {project.contactName ||
//                       project.builder ||
//                       "Project Developer"}
//                   </h3>

//                   <p>Project Developer</p>
//                 </div>
//               </div>

//               <div className="owner-contact-divider" />

//               <div className="owner-contact-detail">
//                 <span>PROJECT</span>
//                 <strong>{project.name}</strong>
//               </div>

//               <div className="owner-contact-detail">
//                 <span>LOCATION</span>
//                 <strong>
//                   {[project.location, project.city]
//                     .filter(Boolean)
//                     .join(", ") || "Not specified"}
//                 </strong>
//               </div>

//               {contactNumber && (
//                 <div className="owner-contact-detail">
//                   <span>CONTACT NUMBER</span>
//                   <strong>{contactNumber}</strong>
//                 </div>
//               )}

//               {contactNumber ? (
//                 <>
//                   <a
//                     href={`tel:${contactNumber}`}
//                     className="owner-primary-action"
//                   >
//                     ☎ Contact Builder
//                   </a>

//                   <a
//                     href={`https://wa.me/${contactNumber.replace(
//                       /\D/g,
//                       ""
//                     )}?text=${encodeURIComponent(
//                       `Hello, I am interested in the project "${project.name}" at ${[
//                         project.location,
//                         project.city,
//                       ]
//                         .filter(Boolean)
//                         .join(", ")}. Please share more details.`
//                     )}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="owner-secondary-action"
//                   >
//                     Send Enquiry ↗
//                   </a>
//                 </>
//               ) : (
//                 <p className="owner-card-note">
//                   Builder contact details are currently unavailable.
//                 </p>
//               )}

//               <p className="owner-card-note">
//                 Ask questions about project details, configurations,
//                 amenities and possession information.
//               </p>
//             </div>
//           </aside>
//         </section>
       
//           <NearbyEssentials property={project} />
//       </div>

//       {/* VASTU CHATBOT */}
//       <VastuChatbot property={project} />
//     </div>
//   );
// }

// export default ProjectDetails;

// for project visit


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import VastuChatbot from "../components/VastuChatbot";
import NearbyEssentials from "../components/NearbyEssentials";
import AICallModal from "../components/AICallModal";
import { recordRecentActivity } from "../utils/recentActivity";

const getAnonymousVisitorId = () => {
  const storageKey = "builderbroget_visitor_id";

  let visitorId = localStorage.getItem(storageKey);

  if (!visitorId) {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
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

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
   const [aiCallOpen, setAiCallOpen] = useState(false);

  // Track logged-in and guest project visits.
  const recordProjectVisit = async (projectId) => {
    if (!projectId) return;

    try {
      const token = localStorage.getItem("token");

      // Guests receive a stable anonymous ID.
      // Registered users use their authentication token.
      const anonymousVisitorId = token
        ? null
        : getAnonymousVisitorId();

      const headers = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${API_URL}/visits/${projectId}`,
        {
          entityType: "project",
          ...(anonymousVisitorId && {
            anonymousVisitorId,
          }),
        },
        { headers }
      );

      console.log(
        "Project visit:",
        response.data?.message || "Visit recorded"
      );
    } catch (error) {
      console.error(
        "Project visit tracking error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    let isActive = true;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setProject(null);
        setSelectedImage("");

        const response = await axios.get(
          `${API_URL}/projects/${id}`
        );

        if (!isActive) return;

        const projectData = response.data;

        setProject(projectData);
        recordRecentActivity({
  ...projectData,
  type: "project",
});

        if (projectData.images?.length > 0) {
          setSelectedImage(projectData.images[0]);
        }

        // Record the project visit after fetching project details.
        if (projectData._id) {
          recordProjectVisit(projectData._id);
        }
      } catch (error) {
        console.error("Fetch project error:", error);

        if (isActive) {
          setProject(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProject();
    } else {
      setLoading(false);
      setProject(null);
    }

    return () => {
      isActive = false;
    };
  }, [id]);

  const formatPrice = (price) => {
    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return null;
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="details-loading">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="details-error">
        <h2>Project not found</h2>
        <Link to="/new-projects" className="details-back-home">
          Go Back to Projects
        </Link>
      </div>
    );
  }

  const images =
    project.images?.length > 0
      ? project.images
      : [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000",
        ];

  const configurations = Array.isArray(project.configurations)
    ? project.configurations
    : [];

  const amenities = Array.isArray(project.amenities)
    ? project.amenities
    : [];

  const minPrice = formatPrice(project.minPrice);
  const maxPrice = formatPrice(project.maxPrice);

  let priceRange = "Price on request";

  if (minPrice && maxPrice) {
    priceRange = `${minPrice} - ${maxPrice}`;
  } else if (minPrice) {
    priceRange = `Starting from ${minPrice}`;
  } else if (maxPrice) {
    priceRange = `Up to ${maxPrice}`;
  }

  const contactNumber = project.contactNumber || "";

  const currentImageIndex = Math.max(
    0,
    images.findIndex(
      (image) => image === (selectedImage || images[0])
    )
  );

  return (
    <div className="details-page">
      <div className="details-container">
        {/* BREADCRUMB */}
        <div className="details-breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <Link to="/new-projects">New Projects</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">
            {project.name}
          </span>
        </div>

        {/* PROJECT GALLERY */}
        <section className="details-gallery-layout">
          <div className="details-gallery-main">
            <img
              src={selectedImage || images[0]}
              alt={project.name}
            />

            <div className="property-status-row">
              <span className="property-status">
                <span className="status-dot" />
                {project.status || "Project"}
              </span>

              {project.verified && (
                <span className="property-verified-label">
                  ✓ Verified
                </span>
              )}
            </div>

            <span className="gallery-image-count">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>

          {images.length > 1 && (
            <div className="details-gallery-thumbnails">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={`details-thumbnail ${
                    (selectedImage || images[0]) === image
                      ? "details-thumbnail-active"
                      : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View project image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${project.name} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* PROJECT INTRODUCTION */}
        <section className="property-intro">
          <div className="property-intro-copy">
            <div className="property-eyebrow">
              <span className="eyebrow-line" />
              <span className="eyebrow-number">01</span>
              PROJECT OVERVIEW
            </div>

            <h1 className="property-editorial-title">
              {project.name}
              <span className="title-period">.</span>
            </h1>

            <p className="property-address">
              <span className="address-symbol">⌖</span>
              {[project.location, project.city]
                .filter(Boolean)
                .join(", ") || "Location not specified"}
            </p>

            <div className="property-status-row">

              {project.propertyType && (
                <span className="property-type-label">
                  {project.propertyType}
                </span>
              )}
            </div>
          </div>

          <div className="property-price-panel">
            <span className="price-panel-label">
              PROJECT PRICE RANGE
            </span>

            <h2 className="property-price-value">
              {priceRange}
            </h2>

            <div className="price-panel-rule" />

            <div className="price-panel-bottom">
              <span>Project Investment</span>
              <span>INR</span>
            </div>
          </div>
        </section>

        {/* PROJECT FACTS */}
        <section className="property-facts-section">
          <div className="section-kicker">PROJECT DETAILS</div>

          <div className="property-facts-grid">
            <div className="property-fact">
              <span className="fact-index">01</span>
              <div className="fact-content">
                <span>Property Type</span>
                <strong>
                  {project.propertyType || "Not specified"}
                </strong>
              </div>
              <span className="fact-arrow">↗</span>
            </div>

            <div className="property-fact">
              <span className="fact-index">02</span>
              <div className="fact-content">
                <span>Project Status</span>
                <strong>
                  {project.status || "Not specified"}
                </strong>
              </div>
              <span className="fact-arrow">↗</span>
            </div>

            <div className="property-fact">
              <span className="fact-index">03</span>
              <div className="fact-content">
                <span>Project Area</span>
                <strong>
                  {project.area || "Not specified"}
                </strong>
              </div>
              <span className="fact-arrow">↗</span>
            </div>

            <div className="property-fact">
              <span className="fact-index">04</span>
              <div className="fact-content">
                <span>Possession</span>
                <strong>
                  {project.possession || "To be announced"}
                </strong>
              </div>
              <span className="fact-arrow">↗</span>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT AND BUILDER SIDEBAR */}
        <section className="details-content-layout">
          <div className="details-content-main">
            {/* CONFIGURATIONS */}
            <section className="editorial-section">
              <div className="section-heading-row">
                <div>
                  <span className="section-number">01</span>
                  <h2>Available Configurations</h2>
                </div>
                <span className="section-mark">⌂</span>
              </div>

              {configurations.length > 0 ? (
                <div className="specification-list">
                  {configurations.map((configuration, index) => (
                    <div
                      className="specification-row"
                      key={`${configuration}-${index}`}
                    >
                      <span className="specification-label">
                        Configuration{" "}
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <strong>{configuration}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="description-copy">
                  Configuration details are not available yet.
                </p>
              )}
            </section>

            {/* PROJECT INFORMATION */}
            <section className="editorial-section">
              <div className="section-heading-row">
                <div>
                  <span className="section-number">02</span>
                  <h2>Project Information</h2>
                </div>
                <span className="section-mark">↗</span>
              </div>

              <div className="specification-list">
                <div className="specification-row">
                  <span className="specification-label">
                    Project Name
                  </span>
                  <strong>{project.name}</strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">
                    Builder / Developer
                  </span>
                  <strong>
                    {project.builder || "Not specified"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">
                    Location
                  </span>
                  <strong>
                    {[project.location, project.city]
                      .filter(Boolean)
                      .join(", ") || "Not specified"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">
                    Property Type
                  </span>
                  <strong>
                    {project.propertyType || "Not specified"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">
                    Possession
                  </span>
                  <strong>
                    {project.possession || "To be announced"}
                  </strong>
                </div>

                <div className="specification-row">
                  <span className="specification-label">
                    Price Range
                  </span>
                  <strong>{priceRange}</strong>
                </div>
              </div>
            </section>

            {/* ABOUT PROJECT */}
            <section className="editorial-section description-section">
              <div className="section-heading-row">
                <div>
                  <span className="section-number">03</span>
                  <h2>About This Project</h2>
                </div>
                <span className="section-mark">✳</span>
              </div>

              <div className="description-copy">
                <p>
                  {project.description ||
                    "More information about this project will be available soon."}
                </p>
              </div>
            </section>

            {/* AMENITIES */}
            <section className="editorial-section amenities-section">
              <div className="section-heading-row">
                <div>
                  <span className="section-number">04</span>
                  <h2>Project Amenities</h2>
                </div>
                <span className="amenity-count">
                  {String(amenities.length).padStart(2, "0")} ITEMS
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
                      <span className="amenity-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="amenities-empty">
                  Amenities have not been added yet.
                </div>
              )}
            </section>

            {/* LOCATION */}
            <section className="editorial-section location-section">
              <div className="section-heading-row">
                <div>
                  <span className="section-number">05</span>
                  <h2>Project Location</h2>
                </div>
                <span className="section-mark">⌖</span>
              </div>

              <div className="location-information">
                <span className="location-icon">⌖</span>
                <div>
                  <span className="location-overline">
                    PROJECT ADDRESS
                  </span>
                  <p>
                    {[project.location, project.city]
                      .filter(Boolean)
                      .join(", ") || "Location not specified"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* BUILDER SIDEBAR */}
          <aside className="details-sidebar">
            <div className="owner-editorial-card">
              <div className="owner-card-topline">
                <span className="owner-online-dot" />
                <span className="owner-card-label">
                  PROJECT ENQUIRY
                </span>
              </div>

              <div className="owner-profile">
                <div className="owner-initial">
                  {(project.contactName || project.builder || "B")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>
                    {project.contactName ||
                      project.builder ||
                      "Project Developer"}
                  </h3>
                  <p>Project Developer</p>
                </div>
              </div>

              <div className="owner-contact-divider" />

              <div className="owner-contact-detail">
                <span>PROJECT</span>
                <strong>{project.name}</strong>
              </div>

              <div className="owner-contact-detail">
                <span>LOCATION</span>
                <strong>
                  {[project.location, project.city]
                    .filter(Boolean)
                    .join(", ") || "Not specified"}
                </strong>
              </div>

              {contactNumber && (
                <div className="owner-contact-detail">
                  <span>CONTACT NUMBER</span>
                  <strong>{contactNumber}</strong>
                </div>
              )}

              {contactNumber ? (
                <>
                  <a
                    href={`tel:${contactNumber}`}
                    className="owner-primary-action"
                  >
                    ☎ Contact Builder
                  </a>
                  {/* <button
                type="button"
                className="owner-primary-action"
                onClick={() => setAiCallOpen(true)}
              >
                <span>Request an AI call</span>
                <span>↗</span>
              </button> */}

                  <a
                    href={`https://wa.me/${contactNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hello, I am interested in the project "${project.name}" at ${[
                        project.location,
                        project.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}. Please share more details.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="owner-secondary-action"
                  >
                    Send Enquiry ↗
                  </a>
                </>
              ) : (
                <p className="owner-card-note">
                  Builder contact details are currently unavailable.
                </p>
              )}

              <p className="owner-card-note">
                Ask questions about project details, configurations,
                amenities and possession information.
              </p>
            </div>
          </aside>
        </section>

        <NearbyEssentials property={project} />
      </div>
 {/* AI call modal */}
      {aiCallOpen && (
        <AICallModal
          property={project}
          onClose={() => setAiCallOpen(false)}
        />
      )}

      <VastuChatbot property={project} />
    </div>
  );
}

export default ProjectDetails;
