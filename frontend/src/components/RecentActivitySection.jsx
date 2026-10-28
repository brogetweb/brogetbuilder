
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   getRecentActivity,
//   clearRecentActivity,
// } from "../utils/recentActivity";
// import "./RecentActivitySection.css";

// function RecentActivitySection() {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     setItems(getRecentActivity());
//   }, []);

//   const handleClear = () => {
//     clearRecentActivity();
//     setItems([]);
//   };

//   const formatPrice = (price) => {
//     if (price === null || price === undefined || price === "") {
//       return "Price on request";
//     }

//     const amount = Number(price);

//     if (!Number.isFinite(amount)) return "Price on request";

//     return `₹${amount.toLocaleString("en-IN")}`;
//   };

//   if (items.length === 0) {
//     return (
//       <section className="recent-activity-section">
//         <div className="recent-activity-inner">
//           <span className="recent-activity-eyebrow">
//             YOUR ACTIVITY
//           </span>

//           <h2>Your Recent Activity</h2>

//           <p className="recent-activity-empty">
//             Properties and projects you view will appear here,
//             making it easier to continue your search.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="recent-activity-section">
//       <div className="recent-activity-inner">
//         <div className="recent-activity-heading">
//           <div>
//             <span className="recent-activity-eyebrow">
//               YOUR ACTIVITY
//             </span>

//             <h2>Your Recent Activity</h2>

//             <p>
//               Pick up where you left off and revisit places
//               that caught your attention.
//             </p>
//           </div>

//           <button
//             type="button"
//             className="recent-activity-clear"
//             onClick={handleClear}
//           >
//             Clear History
//           </button>
//         </div>

//         <div className="recent-activity-grid">
//           {items.map((item) => {
//             const detailsPath =
//               item.type === "project"
//                 ? `/project/${item.id}`
//                 : `/property/${item.id}`;

//             return (
//               <Link
//                 to={detailsPath}
//                 key={`${item.type}-${item.id}`}
//                 className="recent-activity-card"
//               >
//                 <div className="recent-activity-image-wrap">
//                   <img
//                     src={
//                       item.image ||
//                       "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=80"
//                     }
//                     alt={item.title}
//                     loading="lazy"
//                   />

//                   <span className="recent-activity-type">
//                     {item.type === "project" ? "PROJECT" : "PROPERTY"}
//                   </span>
//                 </div>

//                 <div className="recent-activity-card-body">
//                   <h3>{item.title}</h3>

//                   <p className="recent-activity-location">
//                     {item.location || "Location not specified"}
//                   </p>

//                   <strong>{formatPrice(item.price)}</strong>

//                   <span className="recent-activity-open">
//                     View Details <span>→</span>
//                   </span>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default RecentActivitySection;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getRecentActivity,
  clearRecentActivity,
} from "../utils/recentActivity";
import "./RecentActivitySection.css";

function RecentActivitySection({ onActivityChange }) {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");

  useEffect(() => {
    // Get login information
    const token = localStorage.getItem("token");

    let storedUser = null;

    try {
      storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      storedUser = null;
    }

    const loggedIn = Boolean(token);
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const name =
        storedUser?.name ||
        storedUser?.fullName ||
        storedUser?.username ||
        storedUser?.email?.split("@")[0] ||
        "User";

      setUserName(name);
    } else {
      setUserName("Guest User");
    }

    const activity = getRecentActivity();

setItems(activity);
onActivityChange?.(activity.length > 0);
  }, [onActivityChange]);

  const handleClear = () => {
    clearRecentActivity();
    setItems([]);
    onActivityChange?.(false);
  };

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price on request";
    }

    const amount = Number(price);

    if (!Number.isFinite(amount)) {
      return "Price on request";
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <section className="recent-activity-section">
      <div className="recent-activity-user">
        <div className="recent-activity-user-icon">
          <svg
            viewBox="0 0 24 24"
            width="21"
            height="21"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
          </svg>
        </div>

        <div className="recent-activity-user-info">
          <span className="recent-activity-user-label">
            {isLoggedIn
              ? "WELCOME BACK"
              : "WELCOME TO BUILDERBROGET"}
          </span>

          <h3>{userName}</h3>
        </div>
      </div>

      <div className="recent-activity-header">
        <div className="recent-activity-title-wrap">
          <span className="recent-activity-eyebrow">
            YOUR ACTIVITY
          </span>

          <h2>Recent Activity</h2>

          <p className="recent-activity-subtitle">
            Pick up where you left off.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            className="recent-activity-clear"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>

     <div className="recent-activity-summary">
  <span>Your Recent Activity</span>

  <Link
    to="/my-activity"
    className="recent-activity-count"
    aria-label={`View your activity, ${items.length} viewed`}
  >
    <span>{items.length}</span>
    <span className="recent-activity-count-label">Viewed</span>
    <span className="recent-activity-count-arrow">↗</span>
  </Link>
</div>

      {/* LOGIN / REGISTER FOR GUEST USERS */}
      {!isLoggedIn && (
        <div className="recent-activity-auth">
          <span className="recent-activity-auth-label">
            YOUR PROPERTY JOURNEY
          </span>

          <h3>Keep exploring with BuilderBroget</h3>

          <p>
            Login or create an account to make it easier to
            continue your property search and revisit projects.
          </p>

         <div className="recent-activity-auth-actions">
  <Link to="/login" className="recent-activity-login">
    Login/Register to Save Activity
  </Link>
</div>

<p className="recent-activity-device-note">
  &amp; see your activities across browsers &amp; devices...
</p>
        </div>
      )}

      {/* PANEL FOOTER */}
      {items.length > 0 && (
        <div className="recent-activity-footer">
          <span>
            Your recently explored projects
          </span>
        </div>
      )}
    </section>
  );
}

export default RecentActivitySection;

