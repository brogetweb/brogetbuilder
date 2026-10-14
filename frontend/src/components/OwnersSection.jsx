// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import axios from "axios";
// // import "./owners.css";

// // function OwnersSection() {
// // const [owners, setOwners] = useState([]);
// // const [loading, setLoading] = useState(true);
// // const [error, setError] = useState("");

// // useEffect(() => {
// // const fetchOwners = async () => {
// // try {
// // setLoading(true);
// // setError("");

 
// //     const response = await axios.get(
// //       "http://localhost:5000/api/public/owners"
// //     );

// //     setOwners(
// //       Array.isArray(response.data)
// //         ? response.data
// //         : response.data.owners || []
// //     );
// //   } catch (err) {
// //     console.error("Error fetching owners:", err);
// //     setError("Looks like our owners have gone off the grid!");
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// // fetchOwners();
 

// // }, []);

// // return ( <section className="owners-section"> <div className="owners-heading"> <div> <span className="owners-eyebrow">
// // THE PEOPLE WITH THE PROPERTY PAPERS </span>

 
// //       <h2>
// //         Meet the People Who Own{" "}
// //         <span>Your Dream Walls</span>
// //       </h2>

// //       <p className="owners-description">
// //         They own the property. You bring the EMI.
// //         Sounds like a partnership, right? 😏
// //         <br />
// //         Explore properties listed by our registered owners
// //         and find your next address.
// //       </p>
// //     </div>

// //     <div className="owners-quote">
// //       <span className="owners-quote-mark">“</span>
// //       <p>
// //         Finding a home is easy.
// //         Finding one that doesn't empty your wallet?
// //         Now that's the real estate challenge.
// //       </p>
// //       <span className="owners-quote-tag">
// //         — HomeEstate Reality Check
// //       </span>
// //     </div>
// //   </div>

// //   {loading ? (
// //     <div className="owners-message">
// //       <div className="owners-loader"></div>
// //       <p>
// //         Checking who owns more properties than you own clothes...
// //       </p>
// //     </div>
// //   ) : error ? (
// //     <div className="owners-message">
// //       <p>{error}</p>
// //       <button
// //         className="owners-retry"
// //         onClick={() => window.location.reload()}
// //       >
// //         Try Again
// //       </button>
// //     </div>
// //   ) : owners.length === 0 ? (
// //     <div className="owners-message">
// //       <p>
// //         No owners yet. Even the landlords are taking a day off. 🏖️
// //       </p>
// //     </div>
// //   ) : (
// //     <>
// //       <div className="owners-grid">
// //         {owners.map((owner) => (
// //           <Link
// //             to={`/owners/${owner._id}/properties`}
// //             className="owner-card"
// //             key={owner._id}
// //           >
// //             <div className="owner-avatar">
// //               {(owner.name || "O").charAt(0).toUpperCase()}
// //             </div>

// //             <div className="owner-info">
// //               <h3>{owner.name || "Property Owner"}</h3>

// //               <p>
// //                 {owner.propertyCount ?? 0}{" "}
// //                 {(owner.propertyCount ?? 0) === 1
// //                   ? "Property"
// //                   : "Properties"}
// //               </p>
// //             </div>

// //             <span className="owner-arrow" aria-hidden="true">
// //               →
// //             </span>
// //           </Link>
// //         ))}
// //       </div>

// //       <p className="owners-footer-quote">
// //         Love at first sight is real. So is checking the property price
// //         three times. 👀
// //       </p>
// //     </>
// //   )}
// // </section>
 

// // );
// // }

// // export default OwnersSection;


// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "./owners.css";

// const quotes = [
//   {
//     text: "Finding a home is easy. Finding one that doesn't empty your wallet? That's the real plot twist.",
//     tag: "HOMEESTATE REALITY CHECK",
//   },
//   {
//     text: "Behind every dream home is someone asking for a security deposit.",
//     tag: "RENTAL LIFE PROBLEMS",
//   },
//   {
//     text: "A home is where the heart is. The EMI is apparently everywhere.",
//     tag: "ADULTING UNLOCKED",
//   },
//   {
//     text: "House hunting: because scrolling through listings counts as cardio.",
//     tag: "PROPERTY HUNTER DIARIES",
//   },
// ];

// function OwnersSection() {
//   const [owners, setOwners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState("default");
//   const [quoteIndex, setQuoteIndex] = useState(0);

//   const fetchOwners = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await axios.get(
//         "http://localhost:5000/api/public/owners"
//       );

//       const data = response.data;

//       setOwners(
//         Array.isArray(data)
//           ? data
//           : Array.isArray(data?.owners)
//             ? data.owners
//             : []
//       );
//     } catch (err) {
//       console.error("Error fetching owners:", err);
//       setError(
//         "Our owners seem to be playing hide-and-seek. Let's try again!"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOwners();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setQuoteIndex((current) => (current + 1) % quotes.length);
//     }, 6000);

//     return () => clearInterval(interval);
//   }, []);

//   const filteredOwners = useMemo(() => {
//     const result = owners.filter((owner) =>
//       (owner.name || "Property Owner")
//         .toLowerCase()
//         .includes(search.trim().toLowerCase())
//     );

//     if (sortBy === "name") {
//       result.sort((a, b) =>
//         (a.name || "").localeCompare(b.name || "")
//       );
//     }

//     if (sortBy === "properties") {
//       result.sort(
//         (a, b) =>
//           (b.propertyCount ?? 0) - (a.propertyCount ?? 0)
//       );
//     }

//     return result;
//   }, [owners, search, sortBy]);

//   const totalProperties = owners.reduce(
//     (total, owner) => total + (Number(owner.propertyCount) || 0),
//     0
//   );

//   const activeQuote = quotes[quoteIndex];

//   return (
//     <section className="owners-section" id="property-owners">
//       <div className="owners-shell">
//         {/* HERO */}
//         <div className="owners-hero">
//           <div className="owners-hero-content">
//             <div className="owners-eyebrow">
//               <span className="owners-live-dot" />
//               THE PEOPLE BEHIND THE PROPERTIES
//             </div>

//             <h2 className="owners-title">
//               Every home has
//               <br />
//               a story.
//               <br />
//               <span>Meet its owner.</span>
//             </h2>

//             <p className="owners-description">
//               Real people. Real properties. Your potential new
//               address. Explore our registered owners and discover
//               where your next chapter could begin.
//             </p>

//             <a href="#owners-directory" className="owners-explore-btn">
//               Explore our owners
//               <span>↘</span>
//             </a>

//             <div className="owners-mini-note">
//               <span>🏡</span>
//               Your next home might be one click away.
//             </div>
//           </div>

//           {/* INTERACTIVE QUOTE */}
//           <div className="owners-hero-visual">
//             <div className="owners-orbit orbit-one" />
//             <div className="owners-orbit orbit-two" />

//             <div className="owners-floating-tag tag-top">
//               <span>✦</span> HOME SWEET HOME
//             </div>

//             <div className="owners-house-art" aria-hidden="true">
//               <div className="house-roof" />
//               <div className="house-body">
//                 <div className="house-window window-left" />
//                 <div className="house-window window-right" />
//                 <div className="house-door" />
//               </div>
//               <div className="house-ground" />
//             </div>

//             <div className="owners-quote-card">
//               <span className="owners-quote-mark">“</span>

//               <p key={quoteIndex} className="owners-quote-text">
//                 {activeQuote.text}
//               </p>

//               <div className="owners-quote-bottom">
//                 <span>{activeQuote.tag}</span>

//                 <div className="owners-quote-dots">
//                   {quotes.map((quote, index) => (
//                     <button
//                       key={quote.tag}
//                       type="button"
//                       aria-label={`Show quote ${index + 1}`}
//                       aria-pressed={quoteIndex === index}
//                       className={
//                         quoteIndex === index
//                           ? "quote-dot active"
//                           : "quote-dot"
//                       }
//                       onClick={() => setQuoteIndex(index)}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="owners-floating-tag tag-bottom">
//               ✨ GOOD HOMES. REAL PEOPLE.
//             </div>
//           </div>
//         </div>

//         {/* LIVE STATISTICS */}
//         <div className="owners-stats">
//           <div className="owners-stat">
//             <span className="owners-stat-icon">♙</span>
//             <div>
//               <strong>{loading ? "—" : owners.length}</strong>
//               <span>Registered owners</span>
//             </div>
//           </div>

//           <div className="owners-stat-divider" />

//           <div className="owners-stat">
//             <span className="owners-stat-icon">⌂</span>
//             <div>
//               <strong>{loading ? "—" : totalProperties}</strong>
//               <span>Listed properties</span>
//             </div>
//           </div>

//           <div className="owners-stat-note">
//             <span>THE REAL ESTATE ROSTER</span>
//             <p>Meet the humans behind the house keys.</p>
//           </div>
//         </div>

//         {/* OWNER DIRECTORY */}
//         <div className="owners-directory" id="owners-directory">
//           <div className="owners-directory-heading">
//             <div>
//               <span className="owners-section-kicker">
//                 YOUR NEXT CHAPTER STARTS HERE
//               </span>

//               <h3>
//                 The owner <span>directory.</span>
//               </h3>

//               <p>
//                 Browse the people listing properties on HomeEstate.
//                 No crystal ball required.
//               </p>
//             </div>

//             <span className="owners-result-count">
//               {loading
//                 ? "Finding owners..."
//                 : `${filteredOwners.length} ${
//                     filteredOwners.length === 1 ? "OWNER" : "OWNERS"
//                   } FOUND`}
//             </span>
//           </div>

//           <div className="owners-toolbar">
//             <div className="owners-search">
//               <span aria-hidden="true">⌕</span>

//               <input
//                 type="search"
//                 placeholder="Search owners by name..."
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 aria-label="Search owners by name"
//               />

//               {search && (
//                 <button
//                   type="button"
//                   onClick={() => setSearch("")}
//                   aria-label="Clear search"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>

//             <label className="owners-sort">
//               <span>Sort by</span>

//               <select
//                 value={sortBy}
//                 onChange={(event) => setSortBy(event.target.value)}
//               >
//                 <option value="default">Default order</option>
//                 <option value="name">Name: A–Z</option>
//                 <option value="properties">
//                   Most properties
//                 </option>
//               </select>
//             </label>
//           </div>

//           {loading ? (
//             <div className="owners-grid">
//               {[1, 2, 3, 4, 5, 6].map((item) => (
//                 <div className="owner-skeleton" key={item}>
//                   <div className="skeleton-avatar" />
//                   <div className="skeleton-lines">
//                     <span />
//                     <span />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : error ? (
//             <div className="owners-state">
//               <div className="owners-state-icon">🏚️</div>
//               <h3>Well, this is awkward.</h3>
//               <p>{error}</p>

//               <button
//                 className="owners-retry"
//                 type="button"
//                 onClick={fetchOwners}
//               >
//                 Try again ↻
//               </button>
//             </div>
//           ) : owners.length === 0 ? (
//             <div className="owners-state">
//               <div className="owners-state-icon">🏡</div>
//               <h3>A little too much peace and quiet.</h3>
//               <p>
//                 No owners have listed themselves here yet.
//                 Even the landlords are taking a day off. 🏖️
//               </p>
//             </div>
//           ) : filteredOwners.length === 0 ? (
//             <div className="owners-state">
//               <div className="owners-state-icon">🔎</div>
//               <h3>No owners by that name.</h3>
//               <p>
//                 Try another search. Your future landlord might
//                 be a spelling mistake away.
//               </p>

//               <button
//                 className="owners-retry"
//                 type="button"
//                 onClick={() => setSearch("")}
//               >
//                 Clear search
//               </button>
//             </div>
//           ) : (
//             <div className="owners-grid">
//               {filteredOwners.map((owner, index) => {
//                 const propertyCount = Number(owner.propertyCount) || 0;
//                 const initial = (owner.name || "O")
//                   .trim()
//                   .charAt(0)
//                   .toUpperCase() || "O";

//                 return (
//                   <Link
//                     to={`/owners/${owner._id}/properties`}
//                     className="owner-card"
//                     key={owner._id}
//                     style={{ "--card-index": index }}
//                   >
//                     <div className="owner-card-top">
//                       <span className="owner-index">
//                         {String(index + 1).padStart(2, "0")}
//                       </span>

//                       <span className="owner-card-arrow">
//                         ↗
//                       </span>
//                     </div>

//                     <div className="owner-card-main">
//                       <div className="owner-avatar">
//                         {initial}
//                         <span className="owner-avatar-sparkle">
//                           ✦
//                         </span>
//                       </div>

//                       <div className="owner-info">
//                         <h4>{owner.name || "Property Owner"}</h4>
//                         <p>Registered property owner</p>
//                       </div>
//                     </div>

//                     <div className="owner-card-bottom">
//                       <div>
//                         <strong>{propertyCount}</strong>
//                         <span>
//                           {propertyCount === 1
//                             ? " property listed"
//                             : " properties listed"}
//                         </span>
//                       </div>

//                       <span className="owner-view-link">
//                         Explore profile <span>→</span>
//                       </span>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}

//           {!loading && !error && filteredOwners.length > 0 && (
//             <div className="owners-bottom-note">
//               <span>✳</span>
//               Love at first sight is real. So is checking the
//               property price three times.
//               <span>✳</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default OwnersSection;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "./owners.css";

const quotes = [
  {
    text: "Finding a home is easy. Finding one that doesn't empty your wallet? That's the real plot twist.",
    tag: "HOMEESTATE REALITY CHECK",
  },
  {
    text: "Behind every dream home is someone asking for a security deposit.",
    tag: "RENTAL LIFE PROBLEMS",
  },
  {
    text: "A home is where the heart is. The EMI is apparently everywhere.",
    tag: "ADULTING UNLOCKED",
  },
  {
    text: "House hunting: because scrolling through listings counts as cardio.",
    tag: "PROPERTY HUNTER DIARIES",
  },
];

function OwnersSection() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showOwnersPopup, setShowOwnersPopup] = useState(false);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/public/owners`
      );

      const data = response.data;

      setOwners(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.owners)
            ? data.owners
            : []
      );
    } catch (err) {
      console.error("Error fetching owners:", err);
      setError(
        "Our owners seem to be playing hide-and-seek. Let's try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // Rotate the sarcastic quotes.
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Close the popup with Escape and prevent background scrolling.
  useEffect(() => {
    if (!showOwnersPopup) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowOwnersPopup(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showOwnersPopup]);

  const filteredOwners = useMemo(() => {
    const result = owners.filter((owner) =>
      (owner.name || "Property Owner")
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    );

    if (sortBy === "name") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    }

    if (sortBy === "properties") {
      result.sort(
        (a, b) =>
          (Number(b.propertyCount) || 0) -
          (Number(a.propertyCount) || 0)
      );
    }

    return result;
  }, [owners, search, sortBy]);

  const activeQuote = quotes[quoteIndex];

  return (
    <section className="owners-section" id="property-owners">
      <div className="owners-shell">
        {/* HERO */}
        <div className="owners-hero">
          <div className="owners-hero-content">
            <div className="owners-eyebrow">
              <span className="owners-live-dot" />
              THE PEOPLE BEHIND THE PROPERTIES
            </div>

            <h2 className="owners-title">
              Every home has
              <br />
              a story.
              <br />
              <span>Meet its owner.</span>
            </h2>

            <p className="owners-description">
              Real people. Real properties. Your potential new
              address. Explore our registered owners and discover
              where your next chapter could begin.
            </p>

            <button
              type="button"
              className="owners-explore-btn"
              onClick={() => setShowOwnersPopup(true)}
            >
              Explore our owners
              <span>↗</span>
            </button>

            <div className="owners-mini-note">
              <span>🏡</span>
              Your next home might be one click away.
            </div>
          </div>

          {/* INTERACTIVE HOUSE + QUOTE */}
          <div className="owners-hero-visual">
            <div className="owners-orbit orbit-one" />
            <div className="owners-orbit orbit-two" />

            <div className="owners-floating-tag tag-top">
              <span>✦</span> HOME SWEET HOME
            </div>

            <div className="owners-house-art" aria-hidden="true">
              <div className="house-roof" />
              <div className="house-body">
                <div className="house-window window-left" />
                <div className="house-window window-right" />
                <div className="house-door" />
              </div>
              <div className="house-ground" />
            </div>

            <div className="owners-quote-card">
              <span className="owners-quote-mark">“</span>

              <p key={quoteIndex} className="owners-quote-text">
                {activeQuote.text}
              </p>

              <div className="owners-quote-bottom">
                <span>{activeQuote.tag}</span>

                <div className="owners-quote-dots">
                  {quotes.map((quote, index) => (
                    <button
                      key={quote.tag}
                      type="button"
                      aria-label={`Show quote ${index + 1}`}
                      aria-pressed={quoteIndex === index}
                      className={
                        quoteIndex === index
                          ? "quote-dot active"
                          : "quote-dot"
                      }
                      onClick={() => setQuoteIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="owners-floating-tag tag-bottom">
              ✨ GOOD HOMES. REAL PEOPLE.
            </div>
          </div>
        </div>
      </div>

      {/* REGISTERED OWNERS POPUP */}
      {showOwnersPopup && (
        <div
          className="owners-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowOwnersPopup(false);
            }
          }}
        >
          <div
            className="owners-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="owners-modal-title"
          >
            <div className="owners-modal-header">
              <div>
                <span className="owners-section-kicker">
                  YOUR NEXT CHAPTER STARTS HERE
                </span>

                <h2 id="owners-modal-title">
                  Meet our <span>owners.</span>
                </h2>

                <p>
                  The people behind the properties. Your future
                  address could be listed here.
                </p>
              </div>

              <button
                type="button"
                className="owners-modal-close"
                onClick={() => setShowOwnersPopup(false)}
                aria-label="Close registered owners popup"
              >
                ×
              </button>
            </div>

            <div className="owners-modal-summary">
              <span className="owners-summary-icon">♙</span>
              <div>
                <strong>
                  {loading ? "…" : owners.length}
                </strong>
                <span>Registered owners</span>
              </div>

              <span className="owners-summary-note">
                Real people. Real properties.
              </span>
            </div>

            <div className="owners-directory">
              <div className="owners-directory-heading">
                <div>
                  <h3>
                    The owner <span>directory.</span>
                  </h3>
                  <p>
                    Browse registered owners on HomeEstate.
                    No crystal ball required.
                  </p>
                </div>

                <span className="owners-result-count">
                  {loading
                    ? "FINDING OWNERS..."
                    : `${filteredOwners.length} ${
                        filteredOwners.length === 1
                          ? "OWNER"
                          : "OWNERS"
                      } FOUND`}
                </span>
              </div>

              <div className="owners-toolbar">
                <div className="owners-search">
                  <span aria-hidden="true">⌕</span>

                  <input
                    type="search"
                    placeholder="Search owners by name..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    aria-label="Search owners by name"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <label className="owners-sort">
                  <span>Sort by</span>

                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value)
                    }
                  >
                    <option value="default">Default order</option>
                    <option value="name">Name: A–Z</option>
                    <option value="properties">
                      Most properties
                    </option>
                  </select>
                </label>
              </div>

              {loading ? (
                <div className="owners-grid">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div className="owner-skeleton" key={item}>
                      <div className="skeleton-avatar" />
                      <div className="skeleton-lines">
                        <span />
                        <span />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="owners-state">
                  <div className="owners-state-icon">🏚️</div>
                  <h3>Well, this is awkward.</h3>
                  <p>{error}</p>

                  <button
                    className="owners-retry"
                    type="button"
                    onClick={fetchOwners}
                  >
                    Try again ↻
                  </button>
                </div>
              ) : owners.length === 0 ? (
                <div className="owners-state">
                  <div className="owners-state-icon">🏡</div>
                  <h3>A little too much peace and quiet.</h3>
                  <p>
                    No owners have listed themselves here yet.
                    Even the landlords are taking a day off. 🏖️
                  </p>
                </div>
              ) : filteredOwners.length === 0 ? (
                <div className="owners-state">
                  <div className="owners-state-icon">🔎</div>
                  <h3>No owners by that name.</h3>
                  <p>
                    Try another search. Your future landlord might
                    be a spelling mistake away.
                  </p>

                  <button
                    className="owners-retry"
                    type="button"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="owners-grid">
                  {filteredOwners.map((owner, index) => {
                    const propertyCount =
                      Number(owner.propertyCount) || 0;

                    const initial =
                      (owner.name || "O")
                        .trim()
                        .charAt(0)
                        .toUpperCase() || "O";

                    return (
                      <Link
                        to={`/owners/${owner._id}/properties`}
                        className="owner-card"
                        key={owner._id}
                        style={{ "--card-index": index }}
                        onClick={() => setShowOwnersPopup(false)}
                      >
                        <div className="owner-card-top">
                          <span className="owner-index">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="owner-card-arrow">
                            ↗
                          </span>
                        </div>

                        <div className="owner-card-main">
                          <div className="owner-avatar">
                            {initial}
                            <span className="owner-avatar-sparkle">
                              ✦
                            </span>
                          </div>

                          <div className="owner-info">
                            <h4>
                              {owner.name || "Property Owner"}
                            </h4>
                            <p>Registered property owner</p>
                          </div>
                        </div>

                        <div className="owner-card-bottom">
                          <div>
                            <strong>{propertyCount}</strong>
                            <span>
                              {propertyCount === 1
                                ? " property listed"
                                : " properties listed"}
                            </span>
                          </div>

                          <span className="owner-view-link">
                            Explore profile <span>→</span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {!loading &&
                !error &&
                filteredOwners.length > 0 && (
                  <div className="owners-bottom-note">
                    <span>✳</span>
                    Love at first sight is real. So is checking
                    the property price three times.
                    <span>✳</span>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OwnersSection;
