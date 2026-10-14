
// import "./NearbyEssentials.css";

// const essentialCategories = [
//   {
//     name: "Grocery Stores",
//     icon: "🛒",
//     search: "grocery stores and supermarkets"
//   },
//   {
//     name: "Hospitals",
//     icon: "🏥",
//     search: "hospitals"
//   },
//   {
//     name: "Pharmacies",
//     icon: "💊",
//     search: "pharmacies"
//   },
//   {
//     name: "Schools",
//     icon: "🎓",
//     search: "schools"
//   },
//   {
//     name: "Colleges",
//     icon: "🏫",
//     search: "colleges"
//   },
//   {
//     name: "Bus Stops",
//     icon: "🚌",
//     search: "bus stops"
//   },
//   {
//     name: "Railway Stations",
//     icon: "🚆",
//     search: "railway stations"
//   },
//   {
//     name: "ATMs",
//     icon: "🏧",
//     search: "ATMs"
//   },
//   {
//     name: "Restaurants",
//     icon: "🍽️",
//     search: "restaurants"
//   },
//   {
//     name: "Parks",
//     icon: "🌳",
//     search: "parks"
//   }
// ];

// function NearbyEssentials({ property }) {
//   const propertyAddress = [
//     property?.location,
//     property?.city
//   ]
//     .filter(Boolean)
//     .join(", ");

//   const openMapsSearch = (category) => {
//     if (!propertyAddress) {
//       window.alert(
//         "The property's location is unavailable. Please update the property address."
//       );
//       return;
//     }

//     const query = `${category} near ${propertyAddress}`;

//     const mapsUrl =
//       `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//         query
//       )}`;

//     window.open(mapsUrl, "_blank", "noopener,noreferrer");
//   };

//   const openDirections = () => {
//     if (!propertyAddress) {
//       window.alert("The property's location is unavailable.");
//       return;
//     }

//     const mapsUrl =
//       `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
//         propertyAddress
//       )}`;

//     window.open(mapsUrl, "_blank", "noopener,noreferrer");
//   };

//   return (
//     <section className="nearby-essentials">
//       <div className="nearby-heading">
//         <div>
//           <span className="nearby-eyebrow">
//             EXPLORE THE NEIGHBOURHOOD
//           </span>

//           <h2>Daily Essentials Nearby</h2>

//           <p>
//             Find useful places around{" "}
//             {propertyAddress || "this property"}.
//           </p>
//         </div>

//         <div className="nearby-heading-icon">📍</div>
//       </div>

//       <div className="nearby-grid">
//         {essentialCategories.map((category) => (
//           <button
//             type="button"
//             className="nearby-card"
//             key={category.name}
//             onClick={() => openMapsSearch(category.search)}
//           >
//             <span className="nearby-card-icon">
//               {category.icon}
//             </span>

//             <span className="nearby-card-name">
//               {category.name}
//             </span>

//             <span className="nearby-card-action">
//               Find nearby ↗
//             </span>
//           </button>
//         ))}
//       </div>

//       <div className="nearby-footer">
//         <p>
//           Google Maps will show nearby results and available
//           distance information. Actual distances and travel times
//           depend on the selected destination and route.
//         </p>

//         <button
//           type="button"
//           className="nearby-directions-btn"
//           onClick={openDirections}
//         >
//           📍 View Property on Maps
//         </button>
//       </div>
//     </section>
//   );
// }

// export default NearbyEssentials;


import { useState } from "react";
import "./NearbyEssentials.css";

const essentials = [
  { name: "Groceries", icon: "🛒", joke: "Milk won't teleport.", query: "grocery stores" },
  { name: "Hospitals", icon: "🏥", joke: "Hope you never need one. Still check.", query: "hospitals" },
  { name: "Pharmacies", icon: "💊", joke: "For the unexpected plot twists.", query: "pharmacies" },
  { name: "Schools", icon: "🎓", joke: "Tiny humans need good schools.", query: "schools" },
  { name: "Transport", icon: "🚌", joke: "Your commute matters. A lot.", query: "bus stops" },
  { name: "ATMs", icon: "🏧", joke: "Because cash emergencies happen.", query: "ATMs" },
  { name: "Restaurants", icon: "🍕", joke: "Cooking daily? Bold assumption.", query: "restaurants" },
  { name: "Parks", icon: "🌳", joke: "Touch grass occasionally.", query: "parks" },
  { name: "Colleges", icon: "📚", joke: "For the next big chapter.", query: "colleges" },
];

function NearbyEssentials({ property }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const address = [
    property?.location,
    property?.city,
  ]
    .filter((item) => typeof item === "string" && item.trim())
    .join(", ") || "this property";

  const openMaps = (query) => {
    const search = `${query} near ${address}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(search)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="nearby-widget">
      {isOpen && (
        <>
          <button
            className="nearby-backdrop"
            aria-label="Close nearby essentials"
            onClick={() => setIsOpen(false)}
          />

          <section
            className="nearby-popup"
            aria-label="Explore nearby essentials"
          >
            <div className="nearby-popup-header">
              <div>
                <span className="nearby-eyebrow">
                  THE NEIGHBOURHOOD CHECK
                </span>
                <h3>Around this home? 👀</h3>
                <p>
                  The house looks good. What about everything outside?
                </p>
              </div>

              <button
                className="nearby-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="nearby-location">
              <span>📍</span>
              <span>{address}</span>
            </div>

            <div className="nearby-grid">
              {(showAll ? essentials : essentials.slice(0, 6)).map(
                (item) => (
                  <button
                    className="nearby-item"
                    key={item.name}
                    onClick={() => openMaps(item.query)}
                  >
                    <span className="nearby-item-icon">
                      {item.icon}
                    </span>
                    <span className="nearby-item-name">
                      {item.name}
                    </span>
                    <span className="nearby-item-joke">
                      {item.joke}
                    </span>
                    <span className="nearby-item-arrow">↗</span>
                  </button>
                )
              )}
            </div>

            <button
              className="nearby-show-more"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less ↑" : "Explore all essentials ↓"}
            </button>

            <button
              className="nearby-maps-button"
              onClick={() => openMaps("daily essentials")}
            >
              Explore the neighbourhood <span>↗</span>
            </button>

            <p className="nearby-disclaimer">
              Opens Google Maps to explore nearby places. Check actual
              distances and travel times before deciding.
            </p>
          </section>
        </>
      )}

      <button
        className={`nearby-launcher ${isOpen ? "nearby-launcher-active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close nearby essentials" : "Explore nearby essentials"}
      >
        <span className="nearby-launcher-icon">
          {isOpen ? "×" : "⌖"}
        </span>

        <span className="nearby-launcher-label">
          {isOpen ? "Close" : "Around This Home"}
        </span>

        {!isOpen && <span className="nearby-launcher-dot" />}
      </button>
    </div>
  );
}

export default NearbyEssentials;