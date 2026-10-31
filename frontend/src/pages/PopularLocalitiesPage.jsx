
// import { useEffect, useMemo, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../config";
// import "./PopularLocalities.css";

// function PopularLocalitiesPage({ embedded = false }) {
//   const [properties, setProperties] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   const navigate = useNavigate();
//   const scrollContainerRef = useRef(null);

//   const localityImages = [
//     "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=85",
//   ];

//   const scrollLocalities = (direction) => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({
//         left: direction * 350,
//         behavior: "smooth",
//       });
//     }
//   };

//   useEffect(() => {
//     const fetchLocalityData = async () => {
//       try {
//         setLoading(true);

//         const [propertiesResult, projectsResult] =
//           await Promise.allSettled([
//             axios.get(`${API_URL}/properties`),
//             axios.get(`${API_URL}/projects`),
//           ]);

//         if (propertiesResult.status === "fulfilled") {
//           const data = propertiesResult.value.data;
//           setProperties(
//             Array.isArray(data)
//               ? data
//               : data?.properties || []
//           );
//         } else {
//           console.error(
//             "Error fetching properties:",
//             propertiesResult.reason
//           );
//           setProperties([]);
//         }

//         if (projectsResult.status === "fulfilled") {
//           const data = projectsResult.value.data;
//           setProjects(
//             Array.isArray(data)
//               ? data
//               : data?.projects || []
//           );
//         } else {
//           console.error(
//             "Error fetching projects:",
//             projectsResult.reason
//           );
//           setProjects([]);
//         }
//       } catch (error) {
//         console.error("Error fetching locality data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLocalityData();
//   }, []);

//   const localities = useMemo(() => {
//     const localityMap = new Map();

//     const addLocality = (item, type) => {
//       const location =
//         typeof item.location === "string"
//           ? item.location.trim()
//           : "";

//       if (!location) return;

//       const key = location.toLowerCase();

//       if (!localityMap.has(key)) {
//         localityMap.set(key, {
//           name: location,
//           propertyCount: 0,
//           projectCount: 0,
//         });
//       }

//       if (type === "property") {
//         localityMap.get(key).propertyCount += 1;
//       } else {
//         localityMap.get(key).projectCount += 1;
//       }
//     };

//     properties.forEach((property) =>
//       addLocality(property, "property")
//     );

//     projects.forEach((project) =>
//       addLocality(project, "project")
//     );

//     return Array.from(localityMap.values())
//       .map((locality) => ({
//         ...locality,
//         totalCount:
//           locality.propertyCount + locality.projectCount,
//       }))
//       .sort((a, b) => b.totalCount - a.totalCount);
//   }, [properties, projects]);

//   const filteredLocalities = localities.filter((locality) =>
//     locality.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // Keep all matching localities available in the horizontal carousel.
//   const displayedLocalities = filteredLocalities;

//   const handleLocalityClick = (locality) => {
//     navigate(
//       `/properties?location=${encodeURIComponent(locality)}`
//     );
//   };

//   return (
//     <section
//       className={`popular-localities-section ${
//         embedded
//           ? "localities-embedded"
//           : "localities-full-page"
//       }`}
//     >
//       <div className="popular-localities-heading">
//         <div className="localities-heading-copy">
//           <span className="localities-eyebrow">
//             POPULAR LOCALITIES
//           </span>

//           <h2>Explore Top Localities</h2>

//           <p>
//             Discover properties and new projects in your
//             preferred neighbourhoods.
//           </p>
//         </div>

//         <div className="localities-heading-actions">
//           {!embedded && (
//             <input
//               className="localities-search"
//               type="search"
//               placeholder="Search localities..."
//               value={search}
//               onChange={(event) =>
//                 setSearch(event.target.value)
//               }
//               aria-label="Search localities"
//             />
//           )}

//           {embedded && (
//             <button
//               type="button"
//               className="view-all-localities"
//               onClick={() =>
//                 navigate("/popular-localities")
//               }
//             >
//               View All Localities <span>→</span>
//             </button>
//           )}
//         </div>
//       </div>

//       {loading && (
//         <p className="localities-message">
//           Loading properties and projects...
//         </p>
//       )}

//       {!loading && displayedLocalities.length === 0 && (
//         <div className="localities-message">
//           <h3>No localities found</h3>
//           <p>
//             {search
//               ? "Try another locality name."
//               : "Localities will appear when properties or projects are listed."}
//           </p>
//         </div>
//       )}

//       {!loading && displayedLocalities.length > 0 && (
//         <>
//           <div className="localities-carousel-wrapper">
//             <div
//               className="popular-localities-grid"
//               ref={scrollContainerRef}
//             >
//               {displayedLocalities.map((locality, index) => (
//                 <button
//                   type="button"
//                   className="locality-card"
//                   key={locality.name.toLowerCase()}
//                   onClick={() =>
//                     handleLocalityClick(locality.name)
//                   }
//                 >
//                   <div className="locality-image-wrapper">
//                     <img
//                       className="locality-image"
//                       src={
//                         localityImages[
//                           index % localityImages.length
//                         ]
//                       }
//                       alt={`${locality.name} neighbourhood`}
//                       loading="lazy"
//                       onError={(event) => {
//                         event.currentTarget.style.visibility =
//                           "hidden";
//                       }}
//                     />

//                     <span className="locality-rank">
//                       {String(index + 1).padStart(2, "0")}
//                     </span>

//                     <span className="locality-image-overlay" />
//                   </div>

//                   <div className="locality-card-content">
//                     <h3>
//                       <span className="locality-location-icon">
//                         ⌖
//                       </span>
//                       {locality.name}
//                     </h3>

//                     <p className="locality-city">
//                       <span className="locality-city-dot" />
//                       Explore this neighbourhood
//                     </p>

//                     <p className="locality-property-count">
//                       <span className="locality-house-icon">
//                         ⌂
//                       </span>
//                       {locality.propertyCount}{" "}
//                       {locality.propertyCount === 1
//                         ? "Property"
//                         : "Properties"}
//                     </p>

//                     <p className="locality-property-count">
//                       <span className="locality-house-icon">
//                         ▦
//                       </span>
//                       {locality.projectCount}{" "}
//                       {locality.projectCount === 1
//                         ? "Project"
//                         : "Projects"}
//                     </p>

//                     <span className="locality-card-link">
//                       Explore <span>→</span>
//                     </span>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             <button
//               type="button"
//               className="locality-scroll-arrow locality-scroll-left"
//               onClick={() => scrollLocalities(-1)}
//               aria-label="Scroll to previous localities"
//             >
//               ‹
//             </button>

//             <button
//               type="button"
//               className="locality-scroll-arrow locality-scroll-right"
//               onClick={() => scrollLocalities(1)}
//               aria-label="Scroll to next localities"
//             >
//               ›
//             </button>
//           </div>

//           <div className="localities-scroll-track">
//             <div className="localities-scroll-indicator" />
//           </div>
//         </>
//       )}
//     </section>
//   );
// }

// export default PopularLocalitiesPage;

//working 
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../config";
// import "./PopularLocalities.css";

// function PopularLocalitiesPage({ embedded = false }) {
//   const [properties, setProperties] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [selectedCity, setSelectedCity] = useState("All Cities");

//   const navigate = useNavigate();
//   const scrollContainerRef = useRef(null);

//   const localityImages = [
//     "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=85",
//   ];

//   // Read common response shapes returned by the APIs.
//   const getArrayFromResponse = (data, key) => {
//     if (Array.isArray(data)) return data;
//     if (Array.isArray(data?.[key])) return data[key];
//     if (Array.isArray(data?.data)) return data.data;
//     if (Array.isArray(data?.data?.[key])) return data.data[key];

//     return [];
//   };

//   // Fetch properties and projects.
//   useEffect(() => {
//     let isMounted = true;

//     const fetchLocalityData = async () => {
//       setLoading(true);

//       const [propertiesResult, projectsResult] =
//         await Promise.allSettled([
//           axios.get(`${API_URL}/properties`),
//           axios.get(`${API_URL}/projects`),
//         ]);

//       if (!isMounted) return;

//       if (propertiesResult.status === "fulfilled") {
//         setProperties(
//           getArrayFromResponse(
//             propertiesResult.value.data,
//             "properties"
//           )
//         );
//       } else {
//         console.error(
//           "Error fetching properties:",
//           propertiesResult.reason
//         );
//         setProperties([]);
//       }

//       if (projectsResult.status === "fulfilled") {
//         setProjects(
//           getArrayFromResponse(
//             projectsResult.value.data,
//             "projects"
//           )
//         );
//       } else {
//         console.error(
//           "Error fetching projects:",
//           projectsResult.reason
//         );
//         setProjects([]);
//       }

//       if (isMounted) setLoading(false);
//     };

//     fetchLocalityData();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Group listings by city and locality.
//   const localities = useMemo(() => {
//     const localityMap = new Map();

//     const addLocality = (item, type) => {
//       const location =
//         typeof item?.location === "string"
//           ? item.location.trim()
//           : "";

//       const city =
//         typeof item?.city === "string"
//           ? item.city.trim()
//           : "";

//       if (!location) return;

//       const normalizedLocation = location.toLowerCase();
//       const normalizedCity = city.toLowerCase() || "unknown city";
//       const key = `${normalizedCity}|${normalizedLocation}`;

//       if (!localityMap.has(key)) {
//         localityMap.set(key, {
//           name: location,
//           city: city || "City not specified",
//           propertyCount: 0,
//           projectCount: 0,
//         });
//       }

//       const locality = localityMap.get(key);

//       if (type === "property") {
//         locality.propertyCount += 1;
//       } else {
//         locality.projectCount += 1;
//       }
//     };

//     properties.forEach((property) =>
//       addLocality(property, "property")
//     );

//     projects.forEach((project) =>
//       addLocality(project, "project")
//     );

//     return Array.from(localityMap.values())
//       .map((locality) => ({
//         ...locality,
//         totalCount:
//           locality.propertyCount + locality.projectCount,
//       }))
//       .filter((locality) => locality.totalCount > 0)
//       .sort(
//         (a, b) =>
//           b.totalCount - a.totalCount ||
//           a.name.localeCompare(b.name)
//       );
//   }, [properties, projects]);

//   // Build dropdown options from actual API data.
//   const cities = useMemo(() => {
//     const uniqueCities = [
//       ...new Set(
//         localities
//           .filter(
//             (locality) =>
//               locality.city !== "City not specified"
//           )
//           .map((locality) => locality.city)
//       ),
//     ].sort((a, b) => a.localeCompare(b));

//     return ["All Cities", ...uniqueCities];
//   }, [localities]);

//   // Filter localities by selected city and search term.
//   const filteredLocalities = useMemo(() => {
//     const searchValue = search.trim().toLowerCase();

//     return localities.filter((locality) => {
//       const matchesCity =
//         selectedCity === "All Cities" ||
//         locality.city === selectedCity;

//       const matchesSearch =
//         !searchValue ||
//         locality.name.toLowerCase().includes(searchValue) ||
//         locality.city.toLowerCase().includes(searchValue);

//       return matchesCity && matchesSearch;
//     });
//   }, [localities, selectedCity, search]);

//   // Show only the top 8 cards in the embedded homepage section.
//   const displayedLocalities = embedded
//     ? filteredLocalities.slice(0, 8)
//     : filteredLocalities;

//   const scrollLocalities = (direction) => {
//     scrollContainerRef.current?.scrollBy({
//       left: direction * 350,
//       behavior: "smooth",
//     });
//   };

//   const handleLocalityClick = (locality) => {
//     const params = new URLSearchParams();

//     params.set("location", locality.name);

//     if (locality.city !== "City not specified") {
//       params.set("city", locality.city);
//     }

//     navigate(`/properties?${params.toString()}`);
//   };

//   return (
//     <section
//       className={`popular-localities-section ${
//         embedded
//           ? "localities-embedded"
//           : "localities-full-page"
//       }`}
//     >
//       <div className="popular-localities-heading">
//         <div className="localities-heading-copy">
//           <span className="localities-eyebrow">
//             POPULAR LOCALITIES
//           </span>

//           <h2>
//             {embedded
//               ? "Explore Top Localities"
//               : "Discover Your Neighbourhood"}
//           </h2>

//           <p>
//             Discover properties and new projects in your
//             preferred neighbourhoods.
//           </p>
//         </div>

//         <div className="localities-heading-actions">
//           {/* City dropdown is available in both page modes. */}
//           <select
//             className="localities-city-select"
//             value={selectedCity}
//             onChange={(event) => {
//               setSelectedCity(event.target.value);

//               if (scrollContainerRef.current) {
//                 scrollContainerRef.current.scrollTo({
//                   left: 0,
//                   behavior: "smooth",
//                 });
//               }
//             }}
//             aria-label="Select a city"
//           >
//             {cities.map((city) => (
//               <option key={city} value={city}>
//                 {city === "All Cities"
//                   ? "Select City: All Cities"
//                   : city}
//               </option>
//             ))}
//           </select>

//           {!embedded && (
//             <input
//               className="localities-search"
//               type="search"
//               placeholder="Search localities..."
//               value={search}
//               onChange={(event) =>
//                 setSearch(event.target.value)
//               }
//               aria-label="Search localities"
//             />
//           )}

         
//         </div>
//       </div>

//       {!loading && (
//         <div className="localities-results-summary">
//           <span>
//             {filteredLocalities.length}{" "}
//             {filteredLocalities.length === 1
//               ? "locality"
//               : "localities"}{" "}
//             found
//             {selectedCity !== "All Cities"
//               ? ` in ${selectedCity}`
//               : ""}
//           </span>
//         </div>
//       )}

//       {loading && (
//         <p className="localities-message">
//           Loading properties and projects...
//         </p>
//       )}

//       {!loading && displayedLocalities.length === 0 && (
//         <div className="localities-message">
//           <h3>No localities found</h3>
//           <p>
//             {search
//               ? "Try another locality name."
//               : selectedCity !== "All Cities"
//                 ? `No listed localities found in ${selectedCity}.`
//                 : "Localities will appear when properties or projects are listed."}
//           </p>
//         </div>
//       )}

//       {!loading && displayedLocalities.length > 0 && (
//         <>
//           <div className="localities-carousel-wrapper">
//             <div
//               className="popular-localities-grid"
//               ref={scrollContainerRef}
//             >
//               {displayedLocalities.map((locality, index) => (
//                 <button
//                   type="button"
//                   className="locality-card"
//                   key={`${locality.city}-${locality.name}`}
//                   onClick={() => handleLocalityClick(locality)}
//                   aria-label={`Explore ${locality.name}, ${locality.city}`}
//                 >
//                   <div className="locality-image-wrapper">
//                     <img
//                       className="locality-image"
//                       src={
//                         localityImages[
//                           index % localityImages.length
//                         ]
//                       }
//                       alt={`${locality.name} neighbourhood`}
//                       loading="lazy"
//                       onError={(event) => {
//                         event.currentTarget.style.visibility =
//                           "hidden";
//                       }}
//                     />

//                     <span className="locality-rank">
//                       {String(index + 1).padStart(2, "0")}
//                     </span>

//                     <span className="locality-image-overlay" />

//                     <span className="locality-image-label">
//                       Popular locality
//                     </span>
//                   </div>

//                   <div className="locality-card-content">
//                     <h3>
//                       <span className="locality-location-icon">
//                         ⌖
//                       </span>
//                       {locality.name}
//                     </h3>

//                     <p className="locality-city">
//                       <span className="locality-city-dot" />
//                       {locality.city}
//                     </p>

//                     <div className="locality-counts">
//                       <p className="locality-property-count">
//                         <span className="locality-house-icon">
//                           ⌂
//                         </span>
//                         {locality.propertyCount}{" "}
//                         {locality.propertyCount === 1
//                           ? "Property"
//                           : "Properties"}
//                       </p>

//                       <p className="locality-property-count">
//                         <span className="locality-house-icon">
//                           ▦
//                         </span>
//                         {locality.projectCount}{" "}
//                         {locality.projectCount === 1
//                           ? "Project"
//                           : "Projects"}
//                       </p>
//                     </div>

//                     <span className="locality-card-link">
//                       Explore Locality <span>→</span>
//                     </span>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             {displayedLocalities.length > 1 && (
//               <>
//                 <button
//                   type="button"
//                   className="locality-scroll-arrow locality-scroll-left"
//                   onClick={() => scrollLocalities(-1)}
//                   aria-label="Scroll to previous localities"
//                 >
//                   ‹
//                 </button>

//                 <button
//                   type="button"
//                   className="locality-scroll-arrow locality-scroll-right"
//                   onClick={() => scrollLocalities(1)}
//                   aria-label="Scroll to next localities"
//                 >
//                   ›
//                 </button>
//               </>
//             )}
//           </div>

//           {embedded && filteredLocalities.length > 8 && (
//             <button
//               type="button"
//               className="localities-bottom-view-all"
//               onClick={() => navigate("/popular-localities")}
//             >
//               Explore All Localities <span>→</span>
//             </button>
//           )}
//         </>
//       )}
//     </section>
//   );
// }

// export default PopularLocalitiesPage;


//for location
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../config";
// import "./PopularLocalities.css";

// function PopularLocalitiesPage({ embedded = false, userLocation }) {
//   const [properties, setProperties] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [selectedCity, setSelectedCity] = useState("All Cities");

//   const navigate = useNavigate();
//   const scrollContainerRef = useRef(null);

//   const localityImages = [
//     "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=85",
//     "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=85",
//   ];

//   // Read common response shapes returned by the APIs.
//   const getArrayFromResponse = (data, key) => {
//     if (Array.isArray(data)) return data;
//     if (Array.isArray(data?.[key])) return data[key];
//     if (Array.isArray(data?.data)) return data.data;
//     if (Array.isArray(data?.data?.[key])) return data.data[key];

//     return [];
//   };

//   // Fetch properties and projects.
//   useEffect(() => {
//     let isMounted = true;

//     const fetchLocalityData = async () => {
//       setLoading(true);

//      const propertyParams = {};
// const projectParams = {};

// if (userLocation?.city) {
//   propertyParams.city = userLocation.city;
//   projectParams.city = userLocation.city;
// }

// if (userLocation?.locality) {
//   propertyParams.location = userLocation.locality;
//   projectParams.location = userLocation.locality;
// }

// const [propertiesResult, projectsResult] =
//   await Promise.allSettled([
//     axios.get(`${API_URL}/properties`, {
//       params: propertyParams,
//     }),
//     axios.get(`${API_URL}/projects`, {
//       params: projectParams,
//     }),
//   ]);

//       if (!isMounted) return;

//       if (propertiesResult.status === "fulfilled") {
//         setProperties(
//           getArrayFromResponse(
//             propertiesResult.value.data,
//             "properties"
//           )
//         );
//       } else {
//         console.error(
//           "Error fetching properties:",
//           propertiesResult.reason
//         );
//         setProperties([]);
//       }

//       if (projectsResult.status === "fulfilled") {
//         setProjects(
//           getArrayFromResponse(
//             projectsResult.value.data,
//             "projects"
//           )
//         );
//       } else {
//         console.error(
//           "Error fetching projects:",
//           projectsResult.reason
//         );
//         setProjects([]);
//       }

//       if (isMounted) setLoading(false);
//     };

//     fetchLocalityData();

//     return () => {
//       isMounted = false;
//     };
//   }, [userLocation]);

//   // Group listings by city and locality.
//   const localities = useMemo(() => {
//     const localityMap = new Map();

//     const addLocality = (item, type) => {
//       const location =
//         typeof item?.location === "string"
//           ? item.location.trim()
//           : "";

//       const city =
//         typeof item?.city === "string"
//           ? item.city.trim()
//           : "";

//       if (!location) return;

//       const normalizedLocation = location.toLowerCase();
//       const normalizedCity = city.toLowerCase() || "unknown city";
//       const key = `${normalizedCity}|${normalizedLocation}`;

//       if (!localityMap.has(key)) {
//         localityMap.set(key, {
//           name: location,
//           city: city || "City not specified",
//           propertyCount: 0,
//           projectCount: 0,
//         });
//       }

//       const locality = localityMap.get(key);

//       if (type === "property") {
//         locality.propertyCount += 1;
//       } else {
//         locality.projectCount += 1;
//       }
//     };

//     properties.forEach((property) =>
//       addLocality(property, "property")
//     );

//     projects.forEach((project) =>
//       addLocality(project, "project")
//     );

//     return Array.from(localityMap.values())
//       .map((locality) => ({
//         ...locality,
//         totalCount:
//           locality.propertyCount + locality.projectCount,
//       }))
//       .filter((locality) => locality.totalCount > 0)
//       .sort(
//         (a, b) =>
//           b.totalCount - a.totalCount ||
//           a.name.localeCompare(b.name)
//       );
//   }, [properties, projects]);

//   // Build dropdown options from actual API data.
//   const cities = useMemo(() => {
//     const uniqueCities = [
//       ...new Set(
//         localities
//           .filter(
//             (locality) =>
//               locality.city !== "City not specified"
//           )
//           .map((locality) => locality.city)
//       ),
//     ].sort((a, b) => a.localeCompare(b));

//     return ["All Cities", ...uniqueCities];
//   }, [localities]);

//   // Filter localities by selected city and search term.
//   const filteredLocalities = useMemo(() => {
//     const searchValue = search.trim().toLowerCase();

//     return localities.filter((locality) => {
//       const matchesCity =
//         selectedCity === "All Cities" ||
//         locality.city === selectedCity;

//       const matchesSearch =
//         !searchValue ||
//         locality.name.toLowerCase().includes(searchValue) ||
//         locality.city.toLowerCase().includes(searchValue);

//       return matchesCity && matchesSearch;
//     });
//   }, [localities, selectedCity, search]);

//   // Show only the top 8 cards in the embedded homepage section.
//   const displayedLocalities = embedded
//     ? filteredLocalities.slice(0, 8)
//     : filteredLocalities;

//   const scrollLocalities = (direction) => {
//     scrollContainerRef.current?.scrollBy({
//       left: direction * 350,
//       behavior: "smooth",
//     });
//   };

//   const handleLocalityClick = (locality) => {
//     const params = new URLSearchParams();

//     params.set("location", locality.name);

//     if (locality.city !== "City not specified") {
//       params.set("city", locality.city);
//     }

//     navigate(`/properties?${params.toString()}`);
//   };

//   return (
//     <section
//       className={`popular-localities-section ${
//         embedded
//           ? "localities-embedded"
//           : "localities-full-page"
//       }`}
//     >
//       <div className="popular-localities-heading">
//         <div className="localities-heading-copy">
//           <span className="localities-eyebrow">
//             POPULAR LOCALITIES
//           </span>

//           <h2>
//             {embedded
//               ? "Explore Top Localities"
//               : "Discover Your Neighbourhood"}
//           </h2>

//           <p>
//             Discover properties and new projects in your
//             preferred neighbourhoods.
//           </p>
//         </div>

//         <div className="localities-heading-actions">
//           {/* City dropdown is available in both page modes. */}
//           <select
//             className="localities-city-select"
//             value={selectedCity}
//             onChange={(event) => {
//               setSelectedCity(event.target.value);

//               if (scrollContainerRef.current) {
//                 scrollContainerRef.current.scrollTo({
//                   left: 0,
//                   behavior: "smooth",
//                 });
//               }
//             }}
//             aria-label="Select a city"
//           >
//             {cities.map((city) => (
//               <option key={city} value={city}>
//                 {city === "All Cities"
//                   ? "Select City: All Cities"
//                   : city}
//               </option>
//             ))}
//           </select>

//           {!embedded && (
//             <input
//               className="localities-search"
//               type="search"
//               placeholder="Search localities..."
//               value={search}
//               onChange={(event) =>
//                 setSearch(event.target.value)
//               }
//               aria-label="Search localities"
//             />
//           )}

         
//         </div>
//       </div>

//       {!loading && (
//         <div className="localities-results-summary">
//           <span>
//             {filteredLocalities.length}{" "}
//             {filteredLocalities.length === 1
//               ? "locality"
//               : "localities"}{" "}
//             found
//             {selectedCity !== "All Cities"
//               ? ` in ${selectedCity}`
//               : ""}
//           </span>
//         </div>
//       )}

//       {loading && (
//         <p className="localities-message">
//           Loading properties and projects...
//         </p>
//       )}

//       {!loading && displayedLocalities.length === 0 && (
//         <div className="localities-message">
//           <h3>No localities found</h3>
//           <p>
//             {search
//               ? "Try another locality name."
//               : selectedCity !== "All Cities"
//                 ? `No listed localities found in ${selectedCity}.`
//                 : "Localities will appear when properties or projects are listed."}
//           </p>
//         </div>
//       )}

//       {!loading && displayedLocalities.length > 0 && (
//         <>
//           <div className="localities-carousel-wrapper">
//             <div
//               className="popular-localities-grid"
//               ref={scrollContainerRef}
//             >
//               {displayedLocalities.map((locality, index) => (
//                 <button
//                   type="button"
//                   className="locality-card"
//                   key={`${locality.city}-${locality.name}`}
//                   onClick={() => handleLocalityClick(locality)}
//                   aria-label={`Explore ${locality.name}, ${locality.city}`}
//                 >
//                   <div className="locality-image-wrapper">
//                     <img
//                       className="locality-image"
//                       src={
//                         localityImages[
//                           index % localityImages.length
//                         ]
//                       }
//                       alt={`${locality.name} neighbourhood`}
//                       loading="lazy"
//                       onError={(event) => {
//                         event.currentTarget.style.visibility =
//                           "hidden";
//                       }}
//                     />

//                     <span className="locality-rank">
//                       {String(index + 1).padStart(2, "0")}
//                     </span>

//                     <span className="locality-image-overlay" />

//                     <span className="locality-image-label">
//                       Popular locality
//                     </span>
//                   </div>

//                   <div className="locality-card-content">
//                     <h3>
//                       <span className="locality-location-icon">
//                         ⌖
//                       </span>
//                       {locality.name}
//                     </h3>

//                     <p className="locality-city">
//                       <span className="locality-city-dot" />
//                       {locality.city}
//                     </p>

//                     <div className="locality-counts">
//                       <p className="locality-property-count">
//                         <span className="locality-house-icon">
//                           ⌂
//                         </span>
//                         {locality.propertyCount}{" "}
//                         {locality.propertyCount === 1
//                           ? "Property"
//                           : "Properties"}
//                       </p>

//                       <p className="locality-property-count">
//                         <span className="locality-house-icon">
//                           ▦
//                         </span>
//                         {locality.projectCount}{" "}
//                         {locality.projectCount === 1
//                           ? "Project"
//                           : "Projects"}
//                       </p>
//                     </div>

//                     <span className="locality-card-link">
//                       Explore Locality <span>→</span>
//                     </span>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             {displayedLocalities.length > 1 && (
//               <>
//                 <button
//                   type="button"
//                   className="locality-scroll-arrow locality-scroll-left"
//                   onClick={() => scrollLocalities(-1)}
//                   aria-label="Scroll to previous localities"
//                 >
//                   ‹
//                 </button>

//                 <button
//                   type="button"
//                   className="locality-scroll-arrow locality-scroll-right"
//                   onClick={() => scrollLocalities(1)}
//                   aria-label="Scroll to next localities"
//                 >
//                   ›
//                 </button>
//               </>
//             )}
//           </div>

//           {embedded && filteredLocalities.length > 8 && (
//             <button
//               type="button"
//               className="localities-bottom-view-all"
//               onClick={() => navigate("/popular-localities")}
//             >
//               Explore All Localities <span>→</span>
//             </button>
//           )}
//         </>
//       )}
//     </section>
//   );
// }

// export default PopularLocalitiesPage;


//for search selected city
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "./PopularLocalities.css";

function PopularLocalitiesPage({ embedded = false, userLocation,city="" }) {
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const localityImages = [
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=85",
  ];

  // Read common response shapes returned by the APIs.
  const getArrayFromResponse = (data, key) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.[key])) return data.data[key];

    return [];
  };

  // Fetch properties and projects.
 
useEffect(() => {
  let isMounted = true;

  const fetchLocalityData = async () => {
    setLoading(true);

    const activeCity = city?.trim() || userLocation?.city || "";

    const propertyParams = {};
    const projectParams = {};

    // A searched city takes priority over detected location.
    if (activeCity) {
      propertyParams.city = activeCity;
      projectParams.city = activeCity;
    } else if (userLocation?.locality) {
      propertyParams.location = userLocation.locality;
      projectParams.location = userLocation.locality;
    }

    try {
      const [propertiesResult, projectsResult] =
        await Promise.allSettled([
          axios.get(`${API_URL}/properties`, {
            params: propertyParams,
          }),
          axios.get(`${API_URL}/projects`, {
            params: projectParams,
          }),
        ]);

      if (!isMounted) return;

      if (propertiesResult.status === "fulfilled") {
        setProperties(
          getArrayFromResponse(
            propertiesResult.value.data,
            "properties"
          )
        );
      } else {
        console.error(
          "Error fetching properties:",
          propertiesResult.reason
        );
        setProperties([]);
      }

      if (projectsResult.status === "fulfilled") {
        setProjects(
          getArrayFromResponse(
            projectsResult.value.data,
            "projects"
          )
        );
      } else {
        console.error(
          "Error fetching projects:",
          projectsResult.reason
        );
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching locality data:", error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchLocalityData();

  return () => {
    isMounted = false;
  };
}, [city, userLocation]);


  // Group listings by city and locality.
  const localities = useMemo(() => {
    const localityMap = new Map();

    const addLocality = (item, type) => {
      const location =
        typeof item?.location === "string"
          ? item.location.trim()
          : "";

      const city =
        typeof item?.city === "string"
          ? item.city.trim()
          : "";

      if (!location) return;

      const normalizedLocation = location.toLowerCase();
      const normalizedCity = city.toLowerCase() || "unknown city";
      const key = `${normalizedCity}|${normalizedLocation}`;

      if (!localityMap.has(key)) {
        localityMap.set(key, {
          name: location,
          city: city || "City not specified",
          propertyCount: 0,
          projectCount: 0,
        });
      }

      const locality = localityMap.get(key);

      if (type === "property") {
        locality.propertyCount += 1;
      } else {
        locality.projectCount += 1;
      }
    };

    properties.forEach((property) =>
      addLocality(property, "property")
    );

    projects.forEach((project) =>
      addLocality(project, "project")
    );

    return Array.from(localityMap.values())
      .map((locality) => ({
        ...locality,
        totalCount:
          locality.propertyCount + locality.projectCount,
      }))
      .filter((locality) => locality.totalCount > 0)
      .sort(
        (a, b) =>
          b.totalCount - a.totalCount ||
          a.name.localeCompare(b.name)
      );
  }, [properties, projects]);

  // Build dropdown options from actual API data.
  const cities = useMemo(() => {
    const uniqueCities = [
      ...new Set(
        localities
          .filter(
            (locality) =>
              locality.city !== "City not specified"
          )
          .map((locality) => locality.city)
      ),
    ].sort((a, b) => a.localeCompare(b));

    return ["All Cities", ...uniqueCities];
  }, [localities]);

  // Filter localities by selected city and search term.
  const filteredLocalities = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return localities.filter((locality) => {
      const matchesCity =
        selectedCity === "All Cities" ||
        locality.city === selectedCity;

      const matchesSearch =
        !searchValue ||
        locality.name.toLowerCase().includes(searchValue) ||
        locality.city.toLowerCase().includes(searchValue);

      return matchesCity && matchesSearch;
    });
  }, [localities, selectedCity, search]);

  // Show only the top 8 cards in the embedded homepage section.
  const displayedLocalities = embedded
    ? filteredLocalities.slice(0, 8)
    : filteredLocalities;

  const scrollLocalities = (direction) => {
    scrollContainerRef.current?.scrollBy({
      left: direction * 350,
      behavior: "smooth",
    });
  };

  const handleLocalityClick = (locality) => {
    const params = new URLSearchParams();

    params.set("location", locality.name);

    if (locality.city !== "City not specified") {
      params.set("city", locality.city);
    }

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section
      className={`popular-localities-section ${
        embedded
          ? "localities-embedded"
          : "localities-full-page"
      }`}
    >
 <div className="popular-localities-heading">
        <div className="localities-heading-copy">
          <div className="explore-eyebrow">
          <span>EXPLORE YOUR NEIGHBOURHOOD</span>
          <span className="eyebrow-line"></span>
        </div>


         <h2>
  {embedded ? (
    <>Explore <span>Top Localities</span></>
  ) : (
    <>Discover Your <span>Neighbourhood</span></>
  )}
</h2>   
        </div>
  <p className="popular-localities-subtitle">
            Find the neighbourhood that
            <br/>
             feels like home.
          </p>
      </div>
     

      {!loading && (
        <div className="localities-results-summary">
          {/* <span>
            {filteredLocalities.length}{" "}
            {filteredLocalities.length === 1
              ? "locality"
              : "localities"}{" "}
            found
            {selectedCity !== "All Cities"
              ? ` in ${selectedCity}`
              : ""}
          </span> */}
        </div>
      )}

      {loading && (
        <p className="localities-message">
          Loading properties and projects...
        </p>
      )}

      {!loading && displayedLocalities.length === 0 && (
        <div className="localities-message">
          <h3>No localities found</h3>
          <p>
            {search
              ? "Try another locality name."
              : selectedCity !== "All Cities"
                ? `No listed localities found in ${selectedCity}.`
                : "Localities will appear when properties or projects are listed."}
          </p>
        </div>
      )}

      {!loading && displayedLocalities.length > 0 && (
        <>
          <div className="localities-carousel-wrapper">
            <div
              className="popular-localities-grid"
              ref={scrollContainerRef}
            >
              {displayedLocalities.map((locality, index) => (
                <button
                  type="button"
                  className="locality-card"
                  key={`${locality.city}-${locality.name}`}
                  onClick={() => handleLocalityClick(locality)}
                  aria-label={`Explore ${locality.name}, ${locality.city}`}
                >
                  <div className="locality-image-wrapper">
                    <img
                      className="locality-image"
                      src={
                        localityImages[
                          index % localityImages.length
                        ]
                      }
                      alt={`${locality.name} neighbourhood`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.visibility =
                          "hidden";
                      }}
                    />

                    <span className="locality-rank">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="locality-image-overlay" />

                    <span className="locality-image-label">
                      Popular locality
                    </span>
                  </div>

                  <div className="locality-card-content">
                    <h3>
                      <span className="locality-location-icon">
                        ⌖
                      </span>
                      {locality.name}
                    </h3>

                    <p className="locality-city">
                      <span className="locality-city-dot" />
                      {locality.city}
                    </p>

                    <div className="locality-counts">
                      <p className="locality-property-count">
                        <span className="locality-house-icon">
                          ⌂
                        </span>
                        {locality.propertyCount}{" "}
                        {locality.propertyCount === 1
                          ? "Property"
                          : "Properties"}
                      </p>

                      <p className="locality-property-count">
                        <span className="locality-house-icon">
                          ▦
                        </span>
                        {locality.projectCount}{" "}
                        {locality.projectCount === 1
                          ? "Project"
                          : "Projects"}
                      </p>
                    </div>

                    <span className="locality-card-link">
                      Explore Locality <span>→</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {displayedLocalities.length > 1 && (
              <>
                <button
                  type="button"
                  className="locality-scroll-arrow locality-scroll-left"
                  onClick={() => scrollLocalities(-1)}
                  aria-label="Scroll to previous localities"
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="locality-scroll-arrow locality-scroll-right"
                  onClick={() => scrollLocalities(1)}
                  aria-label="Scroll to next localities"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {embedded && filteredLocalities.length > 8 && (
            <button
              type="button"
              className="localities-bottom-view-all"
              onClick={() => navigate("/popular-localities")}
            >
              Explore All Localities <span>→</span>
            </button>
          )}
        </>
      )}
    </section>
  );
}

export default PopularLocalitiesPage;