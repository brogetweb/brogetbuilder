// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config";
// import { Link,useSearchParams} from "react-router-dom";

// import SearchBar from "../components/SearchBar";
// import PropertyCard from "../components/PropertyCard";
// import WhatsAppChatbot from "../components/WhatsAppChatbot";
// import starryHouseImage from "../../images/Futuristic House Under a Starry Sky.png";
// import homeVideo from "../../vidio/bookyourdreamhome.mp4";

// import OwnersSection from "../components/OwnersSection";
// import Testimonials from "./Testimonials";
// import ProjectCard from "../components/ProjectCard";
// import PopularLocalitiesPage from "./PopularLocalitiesPage";
// import PossessionDateSection from "../components/PossessionDateSection";
// import BHKChoiceSection from "../components/BHKChoiceSection";

// function Home({ listingType }) {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sort, setSort] = useState("");
//   const [isVideoMuted, setIsVideoMuted] = useState(true);
//   const [projects, setProjects] = useState([]);
// const [projectsLoading, setProjectsLoading] = useState(false);

// const [searchParams] = useSearchParams();
// const selectedLocation = searchParams.get("location") || "";

// const popularCities = ["Aurangabad", "Mumbai", "Pune", "Nashik", "Banglore", "Hyderabad"];
//  const [cityPropertyCounts, setCityPropertyCounts] = useState({});
//   const [cityCountsLoading, setCityCountsLoading] = useState(true);
 
// const fetchProperties = async (filters = {}) => {
//   try {
//     setLoading(true);

//     const params = {
//       ...(listingType ? { listingType } : {}),
//       ...filters,
//       ...(selectedLocation
//         ? { location: selectedLocation }
//         : {}),
//     };

//     const response = await axios.get(
//       `${API_URL}/properties`,
//       { params }
//     );

//     setProperties(
//       Array.isArray(response.data) ? response.data : []
//     );
//   } catch (error) {
//     console.error("Error fetching properties:", error);
//     setProperties([]);
//   } finally {
//     setLoading(false);
//   }
// };


//  const fetchProjects = async (filters = {}) => {
//   try {
//     setProjectsLoading(true);

//     const response = await axios.get(
//       `${API_URL}/projects`,
//       {
//         params: filters,
//       }
//     );

//     console.log("Projects response:", response.data);

//     setProjects(
//       Array.isArray(response.data)
//         ? response.data
//         : response.data?.projects || []
//     );
//   } catch (error) {
//     console.log("Error fetching projects:", error);
//   } finally {
//     setProjectsLoading(false);
//   }
// };

  

//   useEffect(() => {
//     setSort("newest");

//     const filters = {};

//     if (listingType) {
//       filters.listingType = listingType;
//     }

//     fetchProperties(filters);
//   }, [listingType,selectedLocation]);

//   useEffect(() => {
//   fetchProjects();
// }, []);


// useEffect(() => {
//   const fetchCityPropertyCounts = async () => {
//     try {
//       setCityCountsLoading(true);

//       const response = await axios.get(`${API_URL}/properties`);

//       const properties = Array.isArray(response.data)
//         ? response.data
//         : response.data.properties || response.data.data || [];

//       const counts = {};

//       properties.forEach((property) => {
//         const city = property.city?.trim();

//         if (city) {
//           const normalizedCity = city.toLowerCase();

//           counts[normalizedCity] =
//             (counts[normalizedCity] || 0) + 1;
//         }
//       });

//       setCityPropertyCounts(counts);
//     } catch (error) {
//       console.error("Error fetching city property counts:", error);
//     } finally {
//       setCityCountsLoading(false);
//     }
//   };

//   fetchCityPropertyCounts();
// }, []);
//   const handleSort = (value) => {
//     setSort(value);

//     const filters = {};

//     if (listingType) {
//       filters.listingType = listingType;
//     }

//     if (value) {
//       filters.sort = value;
//     }

//     fetchProperties(filters);
//   };

//   const resetSearch = () => {
//     setSort("");

//     const filters = {};

//     if (listingType) {
//       filters.listingType = listingType;
//     }

//     fetchProperties(filters);
//   };

//   const handleSearch = (filters) => {
//     fetchProperties(filters);
//   };

//   return (
//     <div>

//       {/* ================= HERO ================= */}

//       <section
//         className="hero"
//         style={{ "--hero-image": `url("${starryHouseImage}")` }}
//       >
//         <video
//           className="hero-background-video"
//           src={homeVideo}
//           poster={starryHouseImage}
//           autoPlay
//           loop
//           muted={isVideoMuted}
//           playsInline
//           preload="metadata"
//           aria-hidden="true"
//         />

//         <div className="hero-content">

//           <SearchBar
//             onSearch={handleSearch}
//           />

//           <div className="hero-brand-copy">
//             <h1 className="hero-brand-title">
//               <span className="hero-brand-builder">Builder</span><span className="hero-brand-broget">Broget</span>
//             </h1>
//             <p className="hero-brand-tagline">
//               — Where Your Dream Home Becomes Reality.
//             </p>
//           </div>

//         </div>

//         <button
//           type="button"
//           className="hero-sound-toggle"
//           onClick={() => setIsVideoMuted((muted) => !muted)}
//           aria-label={isVideoMuted ? "Turn background video sound on" : "Mute background video"}
//           aria-pressed={!isVideoMuted}
//         >
//           <span aria-hidden="true">{isVideoMuted ? "♫" : "♪"}</span>
//           Sound {isVideoMuted ? "off" : "on"}
//         </button>

//       </section>


//       {/* ================= QUICK SECTION ================= */}

//       {!listingType && (
//         <section className="quick-section home-quick-section">

//           <h2>
//             Explore Properties
//           </h2>

//           <div className="quick-grid">

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   listingType: "Buy"
//                 })
//               }
//             >
//               🏠
//               <span>
//                 Buy
//               </span>
//             </div>

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   listingType: "Rent"
//                 })
//               }
//             >
//               🔑
//               <span>
//                 Rent
//               </span>

//             </div>

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   propertyType: "Apartment"
//                 })
//               }
//             >
//               🏢
//               <span>
//                 Apartments
//               </span>
//             </div>

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   propertyType: "Villa"
//                 })
//               }
//             >
//               🏡
//               <span>
//                 Villas
//               </span>
//             </div>

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   propertyType: "Plot"
//                 })
//               }
//             >
//               📐
//               <span>
//                 Plots
//               </span>
              
//             </div>
//              <div
//               onClick={() =>
//                 fetchProperties({
//                   propertyType: "Builder-Floors"
//                 })
//               }
//             >
//               🏬
//               <span>
//                 Builder Floors
//               </span>
//             </div>
//           </div>

//         </section>
//       )}

//       {/* ================= PROPERTIES ================= */}

//       <section className="properties-section">

//         <div className="section-header">

//           <div>

//             <h2>
//               {listingType
//                 ? `${listingType} Properties`
//                 : "Recommended Properties"}
//             </h2>

//             <p>
//               {properties.length} properties found
//             </p>

//           </div>


//           <div className="sorting">

//             <select
//               value={sort}
//               onChange={(e) =>
//                 handleSort(e.target.value)
//               }
//             >

//               <option value="">
//                 Sort By
//               </option>

//               <option value="low">
//                 Price: Low to High
//               </option>

//               <option value="high">
//                 Price: High to Low
//               </option>

//             </select>


//             <button
//               onClick={resetSearch}
//             >
//               Reset
//             </button>

//           </div>

//         </div>


//         {loading && (
//           <div className="loading">
//             Loading properties...
//           </div>
//         )}


//         {!loading &&
//           properties.length === 0 && (
//             <div className="no-properties">

//               <h3>
//                 No properties found
//               </h3>

//               <p>
//                 Try changing your search filters.
//               </p>

//               <button
//                 onClick={resetSearch}
//               >
//                 Show All Properties
//               </button>

//             </div>
//           )}


//         <div className="property-grid">

//           {properties.map((property) => (

//             <PropertyCard
//               key={property._id}
//               property={property}
//             />

//           ))}

//         </div>

//       </section>


//       {/* ================= NEW PROJECTS ================= */}

// <section className="properties-section">

//   <div className="section-header">

//     <div>

//       <h2>
//         Featured New Projects
//       </h2>

//       <p>
//         {projects.length} projects found
//       </p>

//     </div>

//     <Link
//       to="/new-projects"
//       className="home-section-btn"
//     >
//       View All Projects
//     </Link>

//   </div>

//   {projectsLoading && (
//     <div className="loading">
//       Loading projects...
//     </div>
//   )}

//   {!projectsLoading &&
//     projects.length === 0 && (
//       <div className="no-properties">

//         <h3>
//           No projects found
//         </h3>

//         <p>
//           Please check again later for new projects.
//         </p>

//       </div>
//     )}

//   <div className="property-grid">

//     {projects.map((project) => (

//       <ProjectCard
//         key={project._id}
//         project={project}
//       />

//     ))}

//   </div>

// </section>

//  <OwnersSection />
//       {/* ================= POPULAR CITIES ================= */}


// <section className="cities-section">
//   <h2>Popular Cities</h2>

//   <div className="city-grid">
//     {popularCities.map((city, index) => {
//       const cityImages = [
//         "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=200&h=200&q=80",
//       ];

//       return (
       
// <div className="city-card" key={city}>
//   <button
//     type="button"
//     className="city-card-content"
//     onClick={() => fetchProperties({ city })}
//     aria-label={`View properties in ${city}`}
//   >
//     <img
//       src={cityImages[index % cityImages.length]}
//       alt={`${city} city`}
//       className="city-card-image"
//       loading="lazy"
//     />

//     <div className="city-card-info">
//       <strong className="city-card-name">{city}</strong>

      
// <span className="city-property-count">
//   {cityCountsLoading
//     ? "Loading properties..."
//     : `${(
//         cityPropertyCounts[city.trim().toLowerCase()] ?? 0
//       ).toLocaleString("en-IN")} Properties`}
// </span>

//     </div>
//   </button>

//   <button
//     type="button"
//     className="city-explore-btn"
//     onClick={() => fetchProperties({ city })}
//   >
//     Explore Properties →
//   </button>
// </div>

//       );
//     })}
//   </div>
// </section>



// <PopularLocalitiesPage embedded={true} />

// <PossessionDateSection/>
    
// <BHKChoiceSection/>

//       {/* ================================================= */}
//       {/*                  ABOUT US PREVIEW                 */}
//       {/* ================================================= */}

//       <section className="home-about-preview">

//         <div className="home-about-content">

//           <span className="section-label">
//             ABOUT BUILDERBROGET
//           </span>

//           <h2>
//             Making Property Search
//             <span>
//               {" "}Simple & Convenient
//             </span>
//           </h2>

//           <p>
//             BuilderBroget is a modern real-estate
//             platform designed to make finding
//             your perfect property simple and
//             convenient.
//           </p>

//           <p>
//             Explore apartments, villas, plots,
//             independent houses and more in your
//             preferred location.
//           </p>

//           <Link
//             to="/about"
//             className="home-section-btn"
//           >
//             Learn More
//           </Link>

//         </div>


//         <div className="home-about-image">

//           <img
//             src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900"
//             alt="Modern Home"
//           />

//         </div>

//       </section>


//       {/* ================================================= */}
//       {/*                WHY CHOOSE US PREVIEW              */}
//       {/* ================================================= */}

//       <section className="home-why-preview">

//         <div className="home-why-heading">

//           <span className="section-label">
//             WHY CHOOSE US
//           </span>

//           <h2>
//             Why Choose BuilderBroget?
//           </h2>

//           <p>
//             We make your property search
//             easier, faster and more convenient.
//           </p>

//         </div>


//         <div className="home-why-grid">

//           <div className="home-why-card">

//             <div className="home-why-icon">
//               ✓
//             </div>

//             <h3>
//               Verified Properties
//             </h3>

//             <p>
//               Discover verified property
//               listings and search with
//               greater confidence.
//             </p>

//           </div>


//           <div className="home-why-card">

//             <div className="home-why-icon">
//               🔍
//             </div>

//             <h3>
//               Smart Search
//             </h3>

//             <p>
//               Find properties using location,
//               price, property type and other
//               useful filters.
//             </p>

//           </div>


//           <div className="home-why-card">

//             <div className="home-why-icon">
//               🏠
//             </div>

//             <h3>
//               Wide Range
//             </h3>

//             <p>
//               Explore apartments, villas,
//               plots, houses and more.
//             </p>

//           </div>


//           <div className="home-why-card">

//             <div className="home-why-icon">
//               🤝
//             </div>

//             <h3>
//               Easy to Connect
//             </h3>

//             <p>
//               Discover properties that
//               match your requirements.
//             </p>

//           </div>

//         </div>


//         <Link
//           to="/why-choose-us"
//           className="home-section-btn"
//         >
//           Explore More
//         </Link>

//       </section>
//        <WhatsAppChatbot />
//        <Testimonials/>

//     </div>
//   );
// }

// export default Home;

//for getting location form user phoone
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config";
// import { Link,useSearchParams} from "react-router-dom";

// import SearchBar from "../components/SearchBar";
// import PropertyCard from "../components/PropertyCard";
// import WhatsAppChatbot from "../components/WhatsAppChatbot";
// import starryHouseImage from "../../images/Futuristic House Under a Starry Sky.png";
// import homeVideo from "../../vidio/bookyourdreamhome.mp4";

// import OwnersSection from "../components/OwnersSection";
// import Testimonials from "./Testimonials";
// import ProjectCard from "../components/ProjectCard";
// import PopularLocalitiesPage from "./PopularLocalitiesPage";
// import PossessionDateSection from "../components/PossessionDateSection";
// import BHKChoiceSection from "../components/BHKChoiceSection";
// import RecentActivitySection from "../components/RecentActivitySection";

// function Home({ listingType }) {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sort, setSort] = useState("");
//   const [isVideoMuted, setIsVideoMuted] = useState(true);
//   const [projects, setProjects] = useState([]);
// const [projectsLoading, setProjectsLoading] = useState(false);

// const [searchParams] = useSearchParams();
// const selectedLocation = searchParams.get("location") || "";

// const popularCities = ["Aurangabad", "Mumbai", "Pune", "Nashik", "Banglore", "Hyderabad"];
//  const [cityPropertyCounts, setCityPropertyCounts] = useState({});
//   const [cityCountsLoading, setCityCountsLoading] = useState(true);
//  const [userLocation, setUserLocation] = useState(null);
// const [locationLoading, setLocationLoading] = useState(false);
// const [locationMessage, setLocationMessage] = useState("");
// const fetchProperties = async (filters = {}) => {
//   try {
//     setLoading(true);

//     const params = {
//       ...(listingType ? { listingType } : {}),
//       ...filters,
//       ...(selectedLocation
//         ? { location: selectedLocation }
//         : {}),
//     };
//  // Apply detected city
//     if (userLocation?.city) {
//       params.city = userLocation.city;
//     }

//     // Apply detected locality when available
//     if (userLocation?.locality) {
//       params.location = userLocation.locality;
//     }

//     // Preserve the existing selected-location filter
//     if (!userLocation?.city && selectedLocation) {
//       params.city = selectedLocation;
//     }

//     const response = await axios.get(
//       `${API_URL}/properties`,
//       { params }
//     );

//     setProperties(
//       Array.isArray(response.data) ? response.data : []
//     );
//   } catch (error) {
//     console.error("Error fetching properties:", error);
//     setProperties([]);
//   } finally {
//     setLoading(false);
//   }
// };


// const fetchProjects = async (filters = {}) => {
//   try {
//     setProjectsLoading(true);

//     const params = { ...filters };

//     if (userLocation?.city) {
//       params.city = userLocation.city;
//     }

//     const response = await axios.get(
//       `${API_URL}/projects`,
//       { params }
//     );

//     const projectData = Array.isArray(response.data)
//       ? response.data
//       : response.data.projects || [];

//     setProjects(projectData);
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//   } finally {
//     setProjectsLoading(false);
//   }
// };
  

//   useEffect(() => {
//     setSort("newest");

//     const filters = {};

//     if (listingType) {
//       filters.listingType = listingType;
//     }

//     fetchProperties(filters);
//   }, [listingType,selectedLocation,userLocation]);

//   useEffect(() => {
//   fetchProjects();
// }, [userLocation]);


// useEffect(() => {
//   const fetchCityPropertyCounts = async () => {
//     try {
//       setCityCountsLoading(true);

//       const response = await axios.get(`${API_URL}/properties`);

//       const properties = Array.isArray(response.data)
//         ? response.data
//         : response.data.properties || response.data.data || [];

//       const counts = {};

//       properties.forEach((property) => {
//         const city = property.city?.trim();

//         if (city) {
//           const normalizedCity = city.toLowerCase();

//           counts[normalizedCity] =
//             (counts[normalizedCity] || 0) + 1;
//         }
//       });

//       setCityPropertyCounts(counts);
//     } catch (error) {
//       console.error("Error fetching city property counts:", error);
//     } finally {
//       setCityCountsLoading(false);
//     }
//   };

//   fetchCityPropertyCounts();
// }, []);
//   const handleSort = (value) => {
//     setSort(value);

//     const filters = {};

//     if (listingType) {
//       filters.listingType = listingType;
//     }

//     if (value) {
//       filters.sort = value;
//     }

//     fetchProperties(filters);
//   };

//   const resetSearch = () => {
//     setSort("");

//     const filters = {};

//     if (listingType) {
//       filters.listingType = listingType;
//     }

//     fetchProperties(filters);
//   };

//   const handleSearch = (filters) => {
//     fetchProperties(filters);
//   };

//   useEffect(() => {
//   if (!navigator.geolocation) {
//     setLocationMessage("Location is not supported by your browser.");
//     return;
//   }

//   setLocationLoading(true);

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       try {
//         const { latitude, longitude } = position.coords;

//         const response = await fetch(
//          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=en`
//         );

//         if (!response.ok) {
//           throw new Error("Location lookup failed");
//         }

//         const data = await response.json();
//         const address = data.address || {};

//         const city =
//           address.city ||
//           address.town ||
//           address.municipality ||
//           address.village ||
//           address.county ||
//           "";

//         const locality =
//           address.suburb ||
//           address.neighbourhood ||
//           address.quarter ||
//           address.residential ||
//           "";

//         if (!city && !locality) {
//           throw new Error("Could not identify the city or locality");
//         }

//         setUserLocation({
//           city,
//           locality,
//           latitude,
//           longitude,
//         });

//         setLocationMessage(
//           `Showing listings for ${[locality, city]
//             .filter(Boolean)
//             .join(", ")}`
//         );
//       } catch (error) {
//         console.error("Location lookup error:", error);
//         setLocationMessage("Unable to identify your area.");
//       } finally {
//         setLocationLoading(false);
//       }
//     },
//     (error) => {
//       console.error("Browser location error:", error);
//       setLocationLoading(false);

//       if (error.code === 1) {
//         setLocationMessage(
//           "Location access denied. You can still browse all listings."
//         );
//       } else {
//         setLocationMessage(
//           "Unable to detect location. You can still browse all listings."
//         );
//       }
//     },
//     {
//       enableHighAccuracy: false,
//       timeout: 15000,
//       maximumAge: 300000,
//     }
//   );
// }, []);

//   const detectUserLocation = () => {
//   if (!navigator.geolocation) {
//     setLocationMessage(
//       "Your browser does not support location access."
//     );
//     return;
//   }

//   setLocationLoading(true);
//   setLocationMessage("Detecting your location...");

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       try {
//         const { latitude, longitude } = position.coords;

//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
//           {
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Unable to resolve location.");
//         }

//         const data = await response.json();
//         const address = data.address || {};

//         const city =
//           address.city ||
//           address.town ||
//           address.municipality ||
//           address.village ||
//           address.county ||
//           "";

//         const locality =
//           address.suburb ||
//           address.neighbourhood ||
//           address.quarter ||
//           address.residential ||
//           "";

//         if (!city && !locality) {
//           throw new Error("Could not identify your city.");
//         }

//         setUserLocation({
//           city,
//           locality,
//           latitude,
//           longitude,
//         });

//         setLocationMessage(
//           `Showing listings for ${[locality, city]
//             .filter(Boolean)
//             .join(", ")}`
//         );
//       } catch (error) {
//         console.error("Location lookup error:", error);
//         setLocationMessage(
//           "Couldn't identify your area. You can browse all listings."
//         );
//       } finally {
//         setLocationLoading(false);
//       }
//     },
//     (error) => {
//       setLocationLoading(false);

//       if (error.code === error.PERMISSION_DENIED) {
//         setLocationMessage(
//           "Location permission denied. You can still browse all listings."
//         );
//       } else {
//         setLocationMessage(
//           "Unable to detect your location. Please try again."
//         );
//       }
//     },
//     {
//       enableHighAccuracy: false,
//       timeout: 15000,
//       maximumAge: 300000,
//     }
//   );
// };

//   return (
//     <div>

//       {/* ================= HERO ================= */}

//       <section
//         className="hero"
//         style={{ "--hero-image": `url("${starryHouseImage}")` }}
//       >
//         <video
//           className="hero-background-video"
//           src={homeVideo}
//           poster={starryHouseImage}
//           autoPlay
//           loop
//           muted={isVideoMuted}
//           playsInline
//           preload="metadata"
//           aria-hidden="true"
//         />

//         <div className="hero-content">

//           <SearchBar
//             onSearch={handleSearch}
//           />

//           <div className="hero-brand-copy">
//             <h1 className="hero-brand-title">
//               <span className="hero-brand-builder">Builder</span><span className="hero-brand-broget">Broget</span>
//             </h1>
//             <p className="hero-brand-tagline">
//               — Where Your Dream Home Becomes Reality.
//             </p>
//           </div>

//         </div>

//         <button
//           type="button"
//           className="hero-sound-toggle"
//           onClick={() => setIsVideoMuted((muted) => !muted)}
//           aria-label={isVideoMuted ? "Turn background video sound on" : "Mute background video"}
//           aria-pressed={!isVideoMuted}
//         >
//           <span aria-hidden="true">{isVideoMuted ? "♫" : "♪"}</span>
//           Sound {isVideoMuted ? "off" : "on"}
//         </button>


//       </section> 
//       {/* ================= QUICK SECTION ================= */}

//       {!listingType && (
//         <section className="quick-section home-quick-section">

//           <h2>
//             Explore Properties
//           </h2>

//           <div className="quick-grid">

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   listingType: "Buy"
//                 })
//               }
//             >
//               🏠
//               <span>
//                 Buy
//               </span>
//             </div>

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   listingType: "Rent"
//                 })
//               }
//             >
//               🔑
//               <span>
//                 Rent
//               </span>

//             </div>

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   propertyType: "Apartment"
//                 })
//               }
//             >
//               🏢
//               <span>
//                 Apartments
//               </span>
//             </div>

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   propertyType: "Villa"
//                 })
//               }
//             >
//               🏡
//               <span>
//                 Villas
//               </span>
//             </div>

//             <div
//               onClick={() =>
//                 fetchProperties({
//                   propertyType: "Plot"
//                 })
//               }
//             >
//               📐
//               <span>
//                 Plots
//               </span>
              
//             </div>
//              <div
//               onClick={() =>
//                 fetchProperties({
//                   propertyType: "Builder-Floors"
//                 })
//               }
//             >
//               🏬
//               <span>
//                 Builder Floors
//               </span>
//             </div>
//           </div>

//         </section>
//       )}

//       {/* ================= PROPERTIES ================= */}

//       <section className="properties-section">

//         <div className="section-header">

//           <div>

//             <h2>
//               {listingType
//                 ? `${listingType} Properties`
//                 : "Recommended Properties"}
//             </h2>

//             <p>
//               {properties.length} properties found
//             </p>

//           </div>


//           <div className="sorting">

//             <select
//               value={sort}
//               onChange={(e) =>
//                 handleSort(e.target.value)
//               }
//             >

//               <option value="">
//                 Sort By
//               </option>

//               <option value="low">
//                 Price: Low to High
//               </option>

//               <option value="high">
//                 Price: High to Low
//               </option>

//             </select>


//             <button
//               onClick={resetSearch}
//             >
//               Reset
//             </button>

//           </div>

//         </div>


//         {loading && (
//           <div className="loading">
//             Loading properties...
//           </div>
//         )}


//         {!loading &&
//           properties.length === 0 && (
//             <div className="no-properties">

//               <h3>
//                 No properties found
//               </h3>

//               <p>
//                 Try changing your search filters.
//               </p>

//               <button
//                 onClick={resetSearch}
//               >
//                 Show All Properties
//               </button>

//             </div>
//           )}


//         <div className="property-grid">

//           {properties.map((property) => (

//             <PropertyCard
//               key={property._id}
//               property={property}
//             />

//           ))}

//         </div>

//       </section>


//       {/* ================= NEW PROJECTS ================= */}

// <section className="properties-section">

//   <div className="section-header">

//     <div>

//       <h2>
//         Featured New Projects
//       </h2>

//       <p>
//         {projects.length} projects found
//       </p>

//     </div>

//     <Link
//       to="/new-projects"
//       className="home-section-btn"
//     >
//       View All Projects
//     </Link>

//   </div>

//   {projectsLoading && (
//     <div className="loading">
//       Loading projects...
//     </div>
//   )}

//   {!projectsLoading &&
//     projects.length === 0 && (
//       <div className="no-properties">

//         <h3>
//           No projects found
//         </h3>

//         <p>
//           Please check again later for new projects.
//         </p>

//       </div>
//     )}

//   <div className="property-grid">

//     {projects.map((project) => (

//       <ProjectCard
//         key={project._id}
//         project={project}
//       />

//     ))}

//   </div>

// </section>

//  <OwnersSection />

// <PopularLocalitiesPage embedded={true}  userLocation={userLocation} />

// <PossessionDateSection  userLocation={userLocation}/>
    
// <BHKChoiceSection  userLocation={userLocation}/>

// <section className="cities-section">
//   <h2>Popular Cities</h2>

//   <div className="city-grid">
//     {popularCities.map((city, index) => {
//       const cityImages = [
//         "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=200&h=200&q=80",
//         "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=200&h=200&q=80",
//       ];

//       return (
       
// <div className="city-card" key={city}>
//   <button
//     type="button"
//     className="city-card-content"
//     onClick={() => fetchProperties({ city })}
//     aria-label={`View properties in ${city}`}
//   >
//     <img
//       src={cityImages[index % cityImages.length]}
//       alt={`${city} city`}
//       className="city-card-image"
//       loading="lazy"
//     />

//     <div className="city-card-info">
//       <strong className="city-card-name">{city}</strong>

      
// <span className="city-property-count">
//   {cityCountsLoading
//     ? "Loading properties..."
//     : `${(
//         cityPropertyCounts[city.trim().toLowerCase()] ?? 0
//       ).toLocaleString("en-IN")} Properties`}
// </span>

//     </div>
//   </button>

//   <button
//     type="button"
//     className="city-explore-btn"
//     onClick={() => fetchProperties({ city })}
//   >
//     Explore Properties →
//   </button>
// </div>

//       );
//     })}
//   </div>
// </section>

//       <section className="home-about-preview">

//         <div className="home-about-content">

//           <span className="section-label">
//             ABOUT BUILDERBROGET
//           </span>

//           <h2>
//             Making Property Search
//             <span>
//               {" "}Simple & Convenient
//             </span>
//           </h2>

//           <p>
//             BuilderBroget is a modern real-estate
//             platform designed to make finding
//             your perfect property simple and
//             convenient.
//           </p>

//           <p>
//             Explore apartments, villas, plots,
//             independent houses and more in your
//             preferred location.
//           </p>

//           <Link
//             to="/about"
//             className="home-section-btn"
//           >
//             Learn More
//           </Link>

//         </div>


//         <div className="home-about-image">

//           <img
//             src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900"
//             alt="Modern Home"
//           />

//         </div>

//       </section>

//       <section className="home-why-preview">

//         <div className="home-why-heading">

//           <span className="section-label">
//             WHY CHOOSE US
//           </span>

//           <h2>
//             Why Choose BuilderBroget?
//           </h2>

//           <p>
//             We make your property search
//             easier, faster and more convenient.
//           </p>

//         </div>


//         <div className="home-why-grid">

//           <div className="home-why-card">

//             <div className="home-why-icon">
//               ✓
//             </div>

//             <h3>
//               Verified Properties
//             </h3>

//             <p>
//               Discover verified property
//               listings and search with
//               greater confidence.
//             </p>

//           </div>


//           <div className="home-why-card">

//             <div className="home-why-icon">
//               🔍
//             </div>

//             <h3>
//               Smart Search
//             </h3>

//             <p>
//               Find properties using location,
//               price, property type and other
//               useful filters.
//             </p>

//           </div>


//           <div className="home-why-card">

//             <div className="home-why-icon">
//               🏠
//             </div>

//             <h3>
//               Wide Range
//             </h3>

//             <p>
//               Explore apartments, villas,
//               plots, houses and more.
//             </p>

//           </div>


//           <div className="home-why-card">

//             <div className="home-why-icon">
//               🤝
//             </div>

//             <h3>
//               Easy to Connect
//             </h3>

//             <p>
//               Discover properties that
//               match your requirements.
//             </p>

//           </div>

//         </div>


//         <Link
//           to="/why-choose-us"
//           className="home-section-btn"
//         >
//           Explore More
//         </Link>

//       </section>
//        <WhatsAppChatbot />
//        <Testimonials/>

//     </div>
//   );
// }

// export default Home;

//for right side of recent activity

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config";
// import { Link, useSearchParams } from "react-router-dom";

// import SearchBar from "../components/SearchBar";
// import PropertyCard from "../components/PropertyCard";
// import WhatsAppChatbot from "../components/WhatsAppChatbot";
// import starryHouseImage from "../../images/Futuristic House Under a Starry Sky.png";
// import homeVideo from "../../vidio/bookyourdreamhome.mp4";

// import OwnersSection from "../components/OwnersSection";
// import Testimonials from "./Testimonials";
// import ProjectCard from "../components/ProjectCard";
// import PopularLocalitiesPage from "./PopularLocalitiesPage";
// import PossessionDateSection from "../components/PossessionDateSection";
// import BHKChoiceSection from "../components/BHKChoiceSection";
// import RecentActivitySection from "../components/RecentActivitySection";
// import WhyChooseUsSection from "../components/WhyChooseUsSection";
// import AboutUsSection from "../components/AboutUsSection";

// function Home({ listingType }) {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sort, setSort] = useState("");
//   const [isVideoMuted, setIsVideoMuted] = useState(true);

//   const [projects, setProjects] = useState([]);
//   const [projectsLoading, setProjectsLoading] = useState(false);

//   const [searchParams] = useSearchParams();
//   const selectedLocation = searchParams.get("location") || "";

//   const popularCities = [
//     "Aurangabad",
//     "Mumbai",
//     "Pune",
//     "Nashik",
//     "Banglore",
//     "Hyderabad",
//   ];

//   const [cityPropertyCounts, setCityPropertyCounts] = useState({});
//   const [cityCountsLoading, setCityCountsLoading] = useState(true);

//   const [userLocation, setUserLocation] = useState(null);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [locationMessage, setLocationMessage] = useState("");
// const [hasRecentProjects, setHasRecentProjects] = useState(false);

//   const fetchProperties = async (filters = {}) => {
//     try {
//       setLoading(true);

//       const params = {
//         ...(listingType ? { listingType } : {}),
//         ...filters,
//         ...(selectedLocation
//           ? { location: selectedLocation }
//           : {}),
//       };

//       // Apply detected city
//       if (userLocation?.city) {
//         params.city = userLocation.city;
//       }

//       // Apply detected locality when available
//       if (userLocation?.locality) {
//         params.location = userLocation.locality;
//       }

//       // Preserve the existing selected-location filter
//       if (!userLocation?.city && selectedLocation) {
//         params.city = selectedLocation;
//       }

//       const response = await axios.get(
//         `${API_URL}/properties`,
//         { params }
//       );

//       setProperties(
//         Array.isArray(response.data) ? response.data : []
//       );
//     } catch (error) {
//       console.error("Error fetching properties:", error);
//       setProperties([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProjects = async (filters = {}) => {
//     try {
//       setProjectsLoading(true);

//       const params = { ...filters };

//       if (userLocation?.city) {
//         params.city = userLocation.city;
//       }

//       const response = await axios.get(
//         `${API_URL}/projects`,
//         { params }
//       );

//       const projectData = Array.isArray(response.data)
//         ? response.data
//         : response.data.projects || [];

//       setProjects(projectData);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     } finally {
//       setProjectsLoading(false);
//     }
//   };

//   useEffect(() => {
//     setSort("newest");

//     const filters = {};

//     if (listingType) {
//       filters.listingType = listingType;
//     }

//     fetchProperties(filters);
//   }, [listingType, selectedLocation, userLocation]);

//   useEffect(() => {
//     fetchProjects();
//   }, [userLocation]);

//   useEffect(() => {
//     const fetchCityPropertyCounts = async () => {
//       try {
//         setCityCountsLoading(true);

//         const response = await axios.get(
//           `${API_URL}/properties`
//         );

//         const propertyData = Array.isArray(response.data)
//           ? response.data
//           : response.data.properties || response.data.data || [];

//         const counts = {};

//         propertyData.forEach((property) => {
//           const city = property.city?.trim();

//           if (city) {
//             const normalizedCity = city.toLowerCase();

//             counts[normalizedCity] =
//               (counts[normalizedCity] || 0) + 1;
//           }
//         });

//         setCityPropertyCounts(counts);
//       } catch (error) {
//         console.error(
//           "Error fetching city property counts:",
//           error
//         );
//       } finally {
//         setCityCountsLoading(false);
//       }
//     };

//     fetchCityPropertyCounts();
//   }, []);

//   const handleSort = (value) => {
//     setSort(value);

//     const filters = {};

//     if (listingType) {
//       filters.listingType = listingType;
//     }

//     if (value) {
//       filters.sort = value;
//     }

//     fetchProperties(filters);
//   };

//   const resetSearch = () => {
//     setSort("");

//     const filters = {};

//     if (listingType) {
//       filters.listingType = listingType;
//     }

//     fetchProperties(filters);
//   };

//   const handleSearch = (filters) => {
//     fetchProperties(filters);
//   };

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setLocationMessage(
//         "Location is not supported by your browser."
//       );
//       return;
//     }

//     setLocationLoading(true);

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords;

//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=en`
//           );

//           if (!response.ok) {
//             throw new Error("Location lookup failed");
//           }

//           const data = await response.json();
//           const address = data.address || {};

//           const city =
//             address.city ||
//             address.town ||
//             address.municipality ||
//             address.village ||
//             address.county ||
//             "";

//           const locality =
//             address.suburb ||
//             address.neighbourhood ||
//             address.quarter ||
//             address.residential ||
//             "";

//           if (!city && !locality) {
//             throw new Error(
//               "Could not identify the city or locality"
//             );
//           }

//           setUserLocation({
//             city,
//             locality,
//             latitude,
//             longitude,
//           });

//           setLocationMessage(
//             `Showing listings for ${[locality, city]
//               .filter(Boolean)
//               .join(", ")}`
//           );
//         } catch (error) {
//           console.error("Location lookup error:", error);
//           setLocationMessage("Unable to identify your area.");
//         } finally {
//           setLocationLoading(false);
//         }
//       },
//       (error) => {
//         console.error("Browser location error:", error);
//         setLocationLoading(false);

//         if (error.code === 1) {
//           setLocationMessage(
//             "Location access denied. You can still browse all listings."
//           );
//         } else {
//           setLocationMessage(
//             "Unable to detect location. You can still browse all listings."
//           );
//         }
//       },
//       {
//         enableHighAccuracy: false,
//         timeout: 15000,
//         maximumAge: 300000,
//       }
//     );
//   }, []);

//   const detectUserLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationMessage(
//         "Your browser does not support location access."
//       );
//       return;
//     }

//     setLocationLoading(true);
//     setLocationMessage("Detecting your location...");

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords;

//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
//             {
//               headers: {
//                 Accept: "application/json",
//               },
//             }
//           );

//           if (!response.ok) {
//             throw new Error("Unable to resolve location.");
//           }

//           const data = await response.json();
//           const address = data.address || {};

//           const city =
//             address.city ||
//             address.town ||
//             address.municipality ||
//             address.village ||
//             address.county ||
//             "";

//           const locality =
//             address.suburb ||
//             address.neighbourhood ||
//             address.quarter ||
//             address.residential ||
//             "";

//           if (!city && !locality) {
//             throw new Error("Could not identify your city.");
//           }

//           setUserLocation({
//             city,
//             locality,
//             latitude,
//             longitude,
//           });

//           setLocationMessage(
//             `Showing listings for ${[locality, city]
//               .filter(Boolean)
//               .join(", ")}`
//           );
//         } catch (error) {
//           console.error("Location lookup error:", error);
//           setLocationMessage(
//             "Couldn't identify your area. You can browse all listings."
//           );
//         } finally {
//           setLocationLoading(false);
//         }
//       },
//       (error) => {
//         setLocationLoading(false);

//         if (error.code === error.PERMISSION_DENIED) {
//           setLocationMessage(
//             "Location permission denied. You can still browse all listings."
//           );
//         } else {
//           setLocationMessage(
//             "Unable to detect location. Please try again."
//           );
//         }
//       },
//       {
//         enableHighAccuracy: false,
//         timeout: 15000,
//         maximumAge: 300000,
//       }
//     );
//   };

//   return (
//     <div>
//       <section
//         className="hero"
//         style={{ "--hero-image": `url("${starryHouseImage}")` }}
//       >
//         <video
//           className="hero-background-video"
//           src={homeVideo}
//           poster={starryHouseImage}
//           autoPlay
//           loop
//           muted={isVideoMuted}
//           playsInline
//           preload="metadata"
//           aria-hidden="true"
//         />

//         <div className="hero-content">
//           <SearchBar onSearch={handleSearch} />

//           <div className="hero-brand-copy">
//             <h1 className="hero-brand-title">
//               <span className="hero-brand-builder">Builder</span>
//               <span className="hero-brand-broget">Broget</span>
//             </h1>

//             <p className="hero-brand-tagline">
//               — Where Your Dream Home Becomes Reality.
//             </p>
//           </div>
//         </div>

//         <button
//           type="button"
//           className="hero-sound-toggle"
//           onClick={() =>
//             setIsVideoMuted((muted) => !muted)
//           }
//           aria-label={
//             isVideoMuted
//               ? "Turn background video sound on"
//               : "Mute background video"
//           }
//           aria-pressed={!isVideoMuted}
//         >
//           <span aria-hidden="true">
//             {isVideoMuted ? "♫" : "♪"}
//           </span>
//           Sound {isVideoMuted ? "off" : "on"}
//         </button>
//       </section>

//       <div className={`home-browse-layout ${
//     hasRecentProjects ? "has-recent-activity" : "no-recent-activity"
//   }`} >
//         <main className="home-browse-main">

//           {!listingType && (
//             <section className="quick-section home-quick-section">
//               <h2>Explore Properties</h2>

//               <div className="quick-grid">
//                 <div
//                   onClick={() =>
//                     fetchProperties({ listingType: "Buy" })
//                   }
//                 >
//                   🏠
//                   <span>Buy</span>
//                 </div>

//                 <div
//                   onClick={() =>
//                     fetchProperties({ listingType: "Rent" })
//                   }
//                 >
//                   🔑
//                   <span>Rent</span>
//                 </div>

//                 <div
//                   onClick={() =>
//                     fetchProperties({ propertyType: "Apartment" })
//                   }
//                 >
//                   🏢
//                   <span>Apartments</span>
//                 </div>

//                 <div
//                   onClick={() =>
//                     fetchProperties({ propertyType: "Villa" })
//                   }
//                 >
//                   🏡
//                   <span>Villas</span>
//                 </div>

//                 <div
//                   onClick={() =>
//                     fetchProperties({ propertyType: "Plot" })
//                   }
//                 >
//                   📐
//                   <span>Plots</span>
//                 </div>

//                 <div
//                   onClick={() =>
//                     fetchProperties({
//                       propertyType: "Builder-Floors",
//                     })
//                   }
//                 >
//                   🏬
//                   <span>Builder Floors</span>
//                 </div>
//               </div>
//             </section>
//           )}

//           <section className="properties-section">
//             <div className="section-header">
//               <div>
//                 <h2>
//                   {listingType
//                     ? `${listingType} Properties`
//                     : "Recommended Properties"}
//                 </h2>

//                 <p>{properties.length} properties found</p>
//               </div>

//               <div className="sorting">
//                 <select
//                   value={sort}
//                   onChange={(e) => handleSort(e.target.value)}
//                 >
//                   <option value="">Sort By</option>
//                   <option value="low">Price: Low to High</option>
//                   <option value="high">Price: High to Low</option>
//                 </select>

//                 <button onClick={resetSearch}>
//                   Reset
//                 </button>
//               </div>
//             </div>

//             {loading && (
//               <div className="loading">
//                 Loading properties...
//               </div>
//             )}

//             {!loading && properties.length === 0 && (
//               <div className="no-properties">
//                 <h3>No properties found</h3>

//                 <p>Try changing your search filters.</p>

//                 <button onClick={resetSearch}>
//                   Show All Properties
//                 </button>
//               </div>
//             )}

//             <div className="property-grid">
//               {properties.map((property) => (
//                 <PropertyCard
//                   key={property._id}
//                   property={property}
//                 />
//               ))}
//             </div>
//           </section>

//           <section className="properties-section">
//             <div className="section-header">
//               <div>
//                 <h2>Featured New Projects</h2>
//                 <p>{projects.length} projects found</p>
//               </div>

//               <Link
//                 to="/new-projects"
//                 className="home-section-btn"
//               >
//                 View All Projects
//               </Link>
//             </div>

//             {projectsLoading && (
//               <div className="loading">
//                 Loading projects...
//               </div>
//             )}

//             {!projectsLoading && projects.length === 0 && (
//               <div className="no-properties">
//                 <h3>No projects found</h3>

//                 <p>
//                   Please check again later for new projects.
//                 </p>
//               </div>
//             )}

//             <div className="property-grid">
//               {projects.map((project) => (
//                 <ProjectCard
//                   key={project._id}
//                   project={project}
//                 />
//               ))}
//             </div>
//           </section>

//           <OwnersSection />

//           <PopularLocalitiesPage
//             embedded={true}
//             userLocation={userLocation}
//           />

//           <PossessionDateSection
//             userLocation={userLocation}
//           />

//           <BHKChoiceSection
//             userLocation={userLocation}
//           />


//           <section className="cities-section">
//             <h2>Popular Cities</h2>

//             <div className="city-grid">
//               {popularCities.map((city, index) => {
//                 const cityImages = [
//                   "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&h=200&q=80",
//                   "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=200&h=200&q=80",
//                   "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&h=200&q=80",
//                   "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=200&h=200&q=80",
//                   "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=200&h=200&q=80",
//                   "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=200&h=200&q=80",
//                   "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=200&h=200&q=80",
//                   "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=200&h=200&q=80",
//                 ];

//                 return (
//                   <div className="city-card" key={city}>
//                     <button
//                       type="button"
//                       className="city-card-content"
//                       onClick={() =>
//                         fetchProperties({ city })
//                       }
//                       aria-label={`View properties in ${city}`}
//                     >
//                       <img
//                         src={cityImages[index % cityImages.length]}
//                         alt={`${city} city`}
//                         className="city-card-image"
//                         loading="lazy"
//                       />

//                       <div className="city-card-info">
//                         <strong className="city-card-name">
//                           {city}
//                         </strong>

//                         <span className="city-property-count">
//                           {cityCountsLoading
//                             ? "Loading properties..."
//                             : `${
//                                 (
//                                   cityPropertyCounts[
//                                     city.trim().toLowerCase()
//                                   ] ?? 0
//                                 ).toLocaleString("en-IN")
//                               } Properties`}
//                         </span>
//                       </div>
//                     </button>

//                     <button
//                       type="button"
//                       className="city-explore-btn"
//                       onClick={() =>
//                         fetchProperties({ city })
//                       }
//                     >
//                       Explore Properties →
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>

//         </main>

//       <aside className="home-recent-activity">
//     <RecentActivitySection
//       onActivityChange={setHasRecentProjects}
//     />
//   </aside>
//       </div>

//       {/* <section className="home-about-preview">
//         <div className="home-about-content">
//           <span className="section-label">
//             ABOUT BUILDERBROGET
//           </span>

//           <h2>
//             Making Property Search
//             <span>{" "}Simple & Convenient</span>
//           </h2>

//           <p>
//             BuilderBroget is a modern real-estate
//             platform designed to make finding
//             your perfect property simple and
//             convenient.
//           </p>

//           <p>
//             Explore apartments, villas, plots,
//             independent houses and more in your
//             preferred location.
//           </p>

//           <Link
//             to="/about"
//             className="home-section-btn"
//           >
//             Learn More
//           </Link>
//         </div>

//         <div className="home-about-image">
//           <img
//             src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900"
//             alt="Modern Home"
//           />
//         </div>
//       </section> */}
//       <AboutUsSection/>

//       {/* <section className="home-why-preview">
//         <div className="home-why-heading">
//           <span className="section-label">
//             WHY CHOOSE US
//           </span>

//           <h2>Why Choose BuilderBroget?</h2>

//           <p>
//             We make your property search
//             easier, faster and more convenient.
//           </p>
//         </div>

//         <div className="home-why-grid">
//           <div className="home-why-card">
//             <div className="home-why-icon">✓</div>

//             <h3>Verified Properties</h3>

//             <p>
//               Discover verified property
//               listings and search with
//               greater confidence.
//             </p>
//           </div>

//           <div className="home-why-card">
//             <div className="home-why-icon">🔍</div>

//             <h3>Smart Search</h3>

//             <p>
//               Find properties using location,
//               price, property type and other
//               useful filters.
//             </p>
//           </div>

//           <div className="home-why-card">
//             <div className="home-why-icon">🏠</div>

//             <h3>Wide Range</h3>

//             <p>
//               Explore apartments, villas,
//               plots, houses and more.
//             </p>
//           </div>

//           <div className="home-why-card">
//             <div className="home-why-icon">🤝</div>

//             <h3>Easy to Connect</h3>

//             <p>
//               Discover properties that
//               match your requirements.
//             </p>
//           </div>
//         </div>

//         <Link
//           to="/why-choose-us"
//           className="home-section-btn"
//         >
//           Explore More
//         </Link>
//       </section> */}

//       <WhyChooseUsSection/>

//       <WhatsAppChatbot />

//       <Testimonials />
//     </div>
//   );
// }

// export default Home;


//for selected city sorting 

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Link, useSearchParams } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import WhatsAppChatbot from "../components/WhatsAppChatbot";
import starryHouseImage from "../../images/Futuristic House Under a Starry Sky.png";
import homeVideo from "../../vidio/bookyourdreamhome.mp4";

import OwnersSection from "../components/OwnersSection";
import Testimonials from "./Testimonials";
import ProjectCard from "../components/ProjectCard";
import PopularLocalitiesPage from "./PopularLocalitiesPage";
import PossessionDateSection from "../components/PossessionDateSection";
import BHKChoiceSection from "../components/BHKChoiceSection";
import RecentActivitySection from "../components/RecentActivitySection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import AboutUsSection from "../components/AboutUsSection";
import ImageSlider from "../components/ImageSlider";

function Home({ listingType }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const selectedLocation = searchParams.get("location") || "";

  const popularCities = [
    "Aurangabad",
    "Mumbai",
    "Pune",
    "Nashik",
    "Banglore",
    "Hyderabad",
  ];

  const [cityPropertyCounts, setCityPropertyCounts] = useState({});
  const [cityCountsLoading, setCityCountsLoading] = useState(true);

  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
const [hasRecentProjects, setHasRecentProjects] = useState(false);
const [selectedCity, setSelectedCity] = useState("");
const [cityPageLoading, setCityPageLoading] = useState(false);
const [searchingCity, setSearchingCity] = useState("");

  const fetchProperties = async (filters = {}) => {
    try {
      setLoading(true);

     const params = {
  ...(listingType ? { listingType } : {}),
  ...filters,
};

if (filters.city) {
  params.city = filters.city;
} else if (selectedCity) {
  params.city = selectedCity;
} else if (userLocation?.city) {
  params.city = userLocation.city;
} else if (selectedLocation) {
  params.city = selectedLocation;
}

if (!filters.city && !selectedCity && userLocation?.locality) {
  params.location = userLocation.locality;
} else if (!filters.city && !selectedCity && selectedLocation) {
  params.location = selectedLocation;
}

      const response = await axios.get(
        `${API_URL}/properties`,
        { params }
      );

      setProperties(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (filters = {}) => {
    try {
      setProjectsLoading(true);

      const params = { ...filters };

if (filters.city) {
  params.city = filters.city;
} else if (selectedCity) {
  params.city = selectedCity;
} else if (userLocation?.city) {
  params.city = userLocation.city;
}

      const response = await axios.get(
        `${API_URL}/projects`,
        { params }
      );

      const projectData = Array.isArray(response.data)
        ? response.data
        : response.data.projects || [];

      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    setSort("newest");

    const filters = {};

    if (listingType) {
      filters.listingType = listingType;
    }

    fetchProperties(filters);
  }, [listingType, selectedLocation, userLocation]);

  useEffect(() => {
    fetchProjects();
  }, [userLocation]);

  useEffect(() => {
    const fetchCityPropertyCounts = async () => {
      try {
        setCityCountsLoading(true);

        const response = await axios.get(
          `${API_URL}/properties`
        );

        const propertyData = Array.isArray(response.data)
          ? response.data
          : response.data.properties || response.data.data || [];

        const counts = {};

        propertyData.forEach((property) => {
          const city = property.city?.trim();

          if (city) {
            const normalizedCity = city.toLowerCase();

            counts[normalizedCity] =
              (counts[normalizedCity] || 0) + 1;
          }
        });

        setCityPropertyCounts(counts);
      } catch (error) {
        console.error(
          "Error fetching city property counts:",
          error
        );
      } finally {
        setCityCountsLoading(false);
      }
    };

    fetchCityPropertyCounts();
  }, []);

  const handleSort = (value) => {
    setSort(value);

    const filters = {};

    if (listingType) {
      filters.listingType = listingType;
    }

    if (value) {
      filters.sort = value;
    }

    fetchProperties(filters);
  };

  const resetSearch = () => {
    setSort("");

    const filters = {};

    if (listingType) {
      filters.listingType = listingType;
    }

    fetchProperties(filters);
  };

const handleSearch = async (filters) => {
  const city = filters.city?.trim() || "";

  setSearchingCity(city);
  setCityPageLoading(true);

  try {
    await Promise.all([
      fetchProperties(filters),
      fetchProjects({ city }),
    ]);
  } finally {
    setCityPageLoading(false);
  }
};


  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location is not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=en`
          );

          if (!response.ok) {
            throw new Error("Location lookup failed");
          }

          const data = await response.json();
          const address = data.address || {};

          const city =
            address.city ||
            address.town ||
            address.municipality ||
            address.village ||
            address.county ||
            "";

          const locality =
            address.suburb ||
            address.neighbourhood ||
            address.quarter ||
            address.residential ||
            "";

          if (!city && !locality) {
            throw new Error(
              "Could not identify the city or locality"
            );
          }

          setUserLocation({
            city,
            locality,
            latitude,
            longitude,
          });

          setLocationMessage(
            `Showing listings for ${[locality, city]
              .filter(Boolean)
              .join(", ")}`
          );
        } catch (error) {
          console.error("Location lookup error:", error);
          setLocationMessage("Unable to identify your area.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Browser location error:", error);
        setLocationLoading(false);

        if (error.code === 1) {
          setLocationMessage(
            "Location access denied. You can still browse all listings."
          );
        } else {
          setLocationMessage(
            "Unable to detect location. You can still browse all listings."
          );
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  }, []);

  const handleCitySelect = async (city) => {
  setSelectedCity(city);
  setCityPageLoading(true);

  try {
    await Promise.all([
      fetchProperties({
        city,
        ...(listingType ? { listingType } : {}),
      }),
      fetchProjects({ city }),
    ]);
  } finally {
    setCityPageLoading(false);
  }
};

  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Your browser does not support location access."
      );
      return;
    }

    setLocationLoading(true);
    setLocationMessage("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Unable to resolve location.");
          }

          const data = await response.json();
          const address = data.address || {};

          const city =
            address.city ||
            address.town ||
            address.municipality ||
            address.village ||
            address.county ||
            "";

          const locality =
            address.suburb ||
            address.neighbourhood ||
            address.quarter ||
            address.residential ||
            "";

          if (!city && !locality) {
            throw new Error("Could not identify your city.");
          }

          setUserLocation({
            city,
            locality,
            latitude,
            longitude,
          });

          setLocationMessage(
            `Showing listings for ${[locality, city]
              .filter(Boolean)
              .join(", ")}`
          );
        } catch (error) {
          console.error("Location lookup error:", error);
          setLocationMessage(
            "Couldn't identify your area. You can browse all listings."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage(
            "Location permission denied. You can still browse all listings."
          );
        } else {
          setLocationMessage(
            "Unable to detect location. Please try again."
          );
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div>
      {cityPageLoading && (
  <div
    className="city-page-loading"
    role="status"
    aria-live="polite"
  >
    <div className="city-loading-content">
      <div className="city-loader"></div>

      <h2>Exploring {selectedCity}</h2>

      <p>
        Loading properties, projects and local real estate details...
      </p>
    </div>
  </div>
)}{cityPageLoading && (
  <div
    className="city-page-loading"
    role="status"
    aria-live="polite"
  >
    <div className="city-loading-content">
      <div className="city-loader"></div>

      <h2>Exploring {selectedCity}</h2>

      <p>
        Loading properties, projects and local real estate details...
      </p>
    </div>
  </div>
)}
      {/* <section
        className="hero"
        style={{ "--hero-image": `url("${starryHouseImage}")` }}
      >
        <video
          className="hero-background-video"
          src={homeVideo}
          poster={starryHouseImage}
          autoPlay
          loop
          muted={isVideoMuted}
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        <div className="hero-content">
          <SearchBar onSearch={handleSearch} />

          <div className="hero-brand-copy">
            <h1 className="hero-brand-title">
              <span className="hero-brand-builder">Builder</span>
              <span className="hero-brand-broget">Broget</span>
            </h1>

            <p className="hero-brand-tagline">
              — Where Your Dream Home Becomes Reality.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="hero-sound-toggle"
          onClick={() =>
            setIsVideoMuted((muted) => !muted)
          }
          aria-label={
            isVideoMuted
              ? "Turn background video sound on"
              : "Mute background video"
          }
          aria-pressed={!isVideoMuted}
        >
          <span aria-hidden="true">
            {isVideoMuted ? "♫" : "♪"}
          </span>
          Sound {isVideoMuted ? "off" : "on"}
        </button>
      </section> */}
      <ImageSlider/>
       <div className='home-search-bar'>
      <SearchBar onSearch={handleSearch} />
    </div>
      

        <main className="home-browse-main">

          {/* {!listingType && (
            <section className="quick-section home-quick-section">
              <h2>Explore Properties</h2>

              <div className="quick-grid">
                <div
                  onClick={() =>
                    fetchProperties({ listingType: "Buy" })
                  }
                >
                  🏠
                  <span>Buy</span>
                </div>

                <div
                  onClick={() =>
                    fetchProperties({ listingType: "Rent" })
                  }
                >
                  🔑
                  <span>Rent</span>
                </div>

                <div
                  onClick={() =>
                    fetchProperties({ propertyType: "Apartment" })
                  }
                >
                  🏢
                  <span>Apartments</span>
                </div>

                <div
                  onClick={() =>
                    fetchProperties({ propertyType: "Villa" })
                  }
                >
                  🏡
                  <span>Villas</span>
                </div>

                <div
                  onClick={() =>
                    fetchProperties({ propertyType: "Plot" })
                  }
                >
                  📐
                  <span>Plots</span>
                </div>

                <div
                  onClick={() =>
                    fetchProperties({
                      propertyType: "Builder-Floors",
                    })
                  }
                >
                  🏬
                  <span>Builder Floors</span>
                </div>
              </div>
            </section>
          )} */}


{!listingType && (
  <section className="explore-properties">
    <div className="explore-properties-header">
      <div className="explore-heading">
        <div className="explore-eyebrow">
          <span>DISCOVER BUILDER BROGET</span>
          <span className="eyebrow-line"></span>
        </div>

        <h2>
          Explore <span> by Category</span>
        </h2>
      </div>

      <p className="explore-subtitle">
        Find the right space
        <br />
        for your next move.
      </p>
    </div>

    <div className="explore-categories">
      <button
        type="button"
        className="explore-category"
        onClick={() => fetchProperties({ listingType: "Buy" })}
        aria-label="Explore properties for sale"
      >
        <div className="explore-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=85"
            alt="Property for sale"
          />
          <span className="explore-image-dot"></span>
        </div>

        <div className="explore-label">
          <span className="explore-number">01</span>
          <span className="explore-label-title">Buy</span>
        </div>

        <span className="explore-arrow">
          <span>→</span>
        </span>
      </button>

      <button
        type="button"
        className="explore-category"
        onClick={() => fetchProperties({ listingType: "Rent" })}
        aria-label="Explore rental properties"
      >
        <div className="explore-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=85"
            alt="Rental home interior"
          />
          <span className="explore-image-dot"></span>
        </div>

        <div className="explore-label">
          <span className="explore-number">02</span>
          <span className="explore-label-title">Rent</span>
        </div>

        <span className="explore-arrow">
          <span>→</span>
        </span>
      </button>

      <button
        type="button"
        className="explore-category"
        onClick={() => fetchProperties({ propertyType: "Apartment" })}
        aria-label="Explore apartments"
      >
        <div className="explore-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=85"
            alt="Modern apartment building"
          />
          <span className="explore-image-dot"></span>
        </div>

        <div className="explore-label">
          <span className="explore-number">03</span>
          <span className="explore-label-title">Apartments</span>
        </div>

        <span className="explore-arrow">
          <span>→</span>
        </span>
      </button>

      <button
        type="button"
        className="explore-category"
        onClick={() => fetchProperties({ propertyType: "Villa" })}
        aria-label="Explore villas"
      >
        <div className="explore-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=85"
            alt="Luxury villa"
          />
          <span className="explore-image-dot"></span>
        </div>

        <div className="explore-label">
          <span className="explore-number">04</span>
          <span className="explore-label-title">Villas</span>
        </div>

        <span className="explore-arrow">
          <span>→</span>
        </span>
      </button>

      <button
        type="button"
        className="explore-category"
        onClick={() => fetchProperties({ propertyType: "Plot" })}
        aria-label="Explore plots and land"
      >
        <div className="explore-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=85"
            alt="Open land plot"
          />
          <span className="explore-image-dot"></span>
        </div>

        <div className="explore-label">
          <span className="explore-number">05</span>
          <span className="explore-label-title">Plots &amp; Land</span>
        </div>

        <span className="explore-arrow">
          <span>→</span>
        </span>
      </button>

      <button
        type="button"
        className="explore-category"
        onClick={() => fetchProperties({ propertyType: "Builder Floor" })}
        aria-label="Explore builder floors"
      >
        <div className="explore-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=85"
            alt="Contemporary residential property"
          />
          <span className="explore-image-dot"></span>
        </div>

        <div className="explore-label">
          <span className="explore-number">06</span>
          <span className="explore-label-title">Builder Floors</span>
        </div>

        <span className="explore-arrow">
          <span>→</span>
        </span>
      </button>
    </div>
  </section>
)}


          <section className="properties-section">
            {selectedCity && (
  <div className="selected-city-banner">
    <div>
      <span>YOUR SELECTED CITY</span>
      <h3>Properties in {selectedCity}</h3>
      <p>Explore homes and real estate opportunities in {selectedCity}.</p>
    </div>

    <button
      type="button"
      onClick={() => {
        setSelectedCity("");
        fetchProperties({});
        fetchProjects({});
      }}
    >
      Clear City
    </button>
  </div>
)}
            <div className="section-header">
              <div>
               <div className="explore-eyebrow">
          <span>HANDPICKED FOR YOU</span>
          <span className="eyebrow-line"></span>
        </div>

<h2>
  {listingType ? (
    `${listingType} Properties`
  ) : (
    <>
      Featured <span>Properties</span>
    </>
  )}
</h2>  
                {/* <p>{properties.length} properties found</p> */}
              </div>

              <div className="sorting">
                <select
                  value={sort}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="">Sort By</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>

                <button onClick={resetSearch}>
                  Reset
                </button>
              </div>
            </div>

            {loading && (
              <div className="loading">
                Loading properties...
              </div>
            )}

            {!loading && properties.length === 0 && (
              <div className="no-properties">
                <h3>No properties found</h3>

                <p>Try changing your search filters.</p>

                <button onClick={resetSearch}>
                  Show All Properties
                </button>
              </div>
            )}

            <div className="property-grid">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          </section>

          <section className="properties-section">
            <div className="section-header">
              <div>
                 <div className="explore-eyebrow">
          <span>EXCLUSIVE DEVELOPMENTS</span>
          <span className="eyebrow-line"></span>
        </div>

                <h2>Featured <span>New Projects</span></h2>
                {/* <p>{projects.length} projects found</p> */}
              </div>

              <Link
                to="/new-projects"
                className="home-section-btn"
              >
                View All Projects
              </Link>
            </div>

            {projectsLoading && (
              <div className="loading">
                Loading projects...
              </div>
            )}

            {!projectsLoading && projects.length === 0 && (
              <div className="no-properties">
                <h3>No projects found</h3>

                <p>
                  Please check again later for new projects.
                </p>
              </div>
            )}

            <div className="property-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                />
              ))}
            </div>
          </section>

          <OwnersSection />

          <PopularLocalitiesPage
            embedded={true}
            userLocation={userLocation}
              city={searchingCity || selectedCity || userLocation?.city || ""}
          />

          <PossessionDateSection
            userLocation={userLocation} 
            city={searchingCity || selectedCity || userLocation?.city || ""}

          />

          <BHKChoiceSection
            userLocation={userLocation}
              city={searchingCity || selectedCity || userLocation?.city || ""}
          />


          <section className="cities-section">
            <div className="cities-header">
      <div className="cities-heading">
        <div className="explore-eyebrow">
          <span>EXPLORE OUR CITIES</span>
          <span className="eyebrow-line"></span>
        </div>

        <h2>Popular <span>Cities</span></h2>
      </div>

      <p className="cities-subtitle">
        Explore vibrant cities and 
        <br/>
        find the perfect location to call home.
      </p>
    </div>


            <div className="city-grid">
              {popularCities.map((city, index) => {
                const cityImages = [
                  "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&h=200&q=80",
                  "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=200&h=200&q=80",
                  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&h=200&q=80",
                  "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=200&h=200&q=80",
                  "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=200&h=200&q=80",
                  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=200&h=200&q=80",
                  "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=200&h=200&q=80",
                  "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=200&h=200&q=80",
                ];

                return (
                  <div className="city-card" key={city}>
                    <button
                      type="button"
                      className="city-card-content"
                     onClick={() => handleCitySelect(city)}
                      aria-label={`View properties in ${city}`}
                    >
                      <img
                        src={cityImages[index % cityImages.length]}
                        alt={`${city} city`}
                        className="city-card-image"
                        loading="lazy"
                      />

                      <div className="city-card-info">
                        <strong className="city-card-name">
                          {city}
                        </strong>

                        <span className="city-property-count">
                          {cityCountsLoading
                            ? "Loading properties..."
                            : `${
                                (
                                  cityPropertyCounts[
                                    city.trim().toLowerCase()
                                  ] ?? 0
                                ).toLocaleString("en-IN")
                              } Properties`}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="city-explore-btn"
                     onClick={() => handleCitySelect(city)}
                    >
                      Explore Properties →
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

        </main>

      {/* <aside className="home-recent-activity">
    <RecentActivitySection
      onActivityChange={setHasRecentProjects}
    />
  </aside> */}
      
      <AboutUsSection/>

      <WhyChooseUsSection/>

      <WhatsAppChatbot />

      <Testimonials />
    </div>
  );
}

export default Home;