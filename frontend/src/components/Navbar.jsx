// import { useEffect, useState } from "react";

// import { Link } from "react-router-dom";

// import axios from "axios";
// import brandLogo from "../assets/brand-logo.svg";

// const navItems = [
//   { label: "Home", to: "/" },
//   { label: "Buy", to: "/buy" },
//   { label: "Rent", to: "/rent" },
//   { label: "PG", to: "/pg" },
//   { label: "New Projects", to: "/new-projects" },
//   { label: "Property News", to: "/property-news" },
//   { label: "Contact Us", to: "/contact-us" },
//   { label: "About Us", to: "/about-us" }
// ];

// function Navbar() {
//   const [menuOpen, setMenuOpen] =
//     useState(false);

//   const [loginOpen, setLoginOpen] =
//     useState(false);

//   const [isRegister, setIsRegister] =
//     useState(false);

//   const [user, setUser] =
//     useState(null);

//   const [name, setName] =
//     useState("");

//   const [email, setEmail] =
//     useState("");

//   const [password, setPassword] =
//     useState("");

//   const [role, setRole] =
//     useState("user");

//   const [authError, setAuthError] =
//     useState("");

//   const [authLoading, setAuthLoading] =
//     useState(false);

//   const DEMO_OWNER = {
//     name: "Demo Owner",
//     email: "owner@homeestate.com",
//     password: "Owner@123",
//     role: "owner"
//   };

//   const applyDemoOwnerSession = () => {
//     const demoUser = {
//       id: "demo-owner",
//       name: DEMO_OWNER.name,
//       email: DEMO_OWNER.email,
//       role: DEMO_OWNER.role
//     };

//     localStorage.setItem(
//       "token",
//       "demo-owner-token"
//     );

//     localStorage.setItem(
//       "user",
//       JSON.stringify(demoUser)
//     );

//     setUser(demoUser);
//     setLoginOpen(false);
//     setName("");
//     setEmail("");
//     setPassword("");
//     setRole("owner");
//     window.dispatchEvent(
//       new Event("authChange")
//     );
//     window.location.href = "/owner-dashboard";
//   };

//   // =====================================
//   // GET USER FROM DATABASE
//   // =====================================

//   const fetchCurrentUser =
//     async () => {
//       try {
//         const token =
//           localStorage.getItem(
//             "token"
//           );

//         if (!token) {
//           setUser(null);
//           return;
//         }

//         if (token === "demo-owner-token") {
//           const savedUser = JSON.parse(
//             localStorage.getItem("user") || "null"
//           );
//           setUser(savedUser);
//           return;
//         }

//         const response =
//           await axios.get(
//             "http://localhost:5000/api/auth/me",
//             {
//               headers: {
//                 Authorization:
//                   `Bearer ${token}`
//               }
//             }
//           );

//         setUser(
//           response.data.user
//         );

//         localStorage.setItem(
//           "user",
//           JSON.stringify(
//             response.data.user
//           )
//         );
//       } catch (error) {
//         console.log(error);

//         localStorage.removeItem(
//           "token"
//         );

//         localStorage.removeItem(
//           "user"
//         );

//         setUser(null);
//       }
//     };

//   // =====================================
//   // CHECK USER WHEN NAVBAR LOADS
//   // =====================================

//   useEffect(() => {
//     fetchCurrentUser();

//     window.addEventListener(
//       "authChange",
//       fetchCurrentUser
//     );

//     return () => {
//       window.removeEventListener(
//         "authChange",
//         fetchCurrentUser
//       );
//     };
//   }, []);

//   // =====================================
//   // OPEN LOGIN
//   // =====================================

//   const openLogin = () => {
//     setLoginOpen(true);

//     setIsRegister(false);

//     setAuthError("");

//     setRole("user");
//   };

//   // =====================================
//   // LOGOUT
//   // =====================================

//   const handleLogout = () => {
//     localStorage.removeItem(
//       "token"
//     );

//     localStorage.removeItem(
//       "user"
//     );

//     setUser(null);

//     window.dispatchEvent(
//       new Event("authChange")
//     );

//     window.location.href = "/";
//   };

//   // =====================================
//   // LOGIN / REGISTER
//   // =====================================

//   const handleAuth =
//     async () => {
//       try {
//         setAuthError("");

//         setAuthLoading(true);

//         const normalizedEmail =
//           String(email || "").trim().toLowerCase();

//         if (
//           normalizedEmail ===
//             DEMO_OWNER.email &&
//           password === DEMO_OWNER.password &&
//           role === DEMO_OWNER.role
//         ) {
//           applyDemoOwnerSession();
//           return;
//         }

//         // =================================
//         // REGISTER
//         // =================================

//         if (isRegister) {
//           if (
//             !name ||
//             !email ||
//             !password
//           ) {
//             setAuthError(
//               "Please fill all fields"
//             );

//             setAuthLoading(false);

//             return;
//           }

//           const response =
//             await axios.post(
//               "http://localhost:5000/api/auth/register",
//               {
//                 name,
//                 email,
//                 password,
//                 role
//               }
//             );

//           localStorage.setItem(
//             "token",
//             response.data.token
//           );

//           localStorage.setItem(
//             "user",
//             JSON.stringify(
//               response.data.user
//             )
//           );

//           await fetchCurrentUser();

//           window.dispatchEvent(
//             new Event("authChange")
//           );

//           setLoginOpen(false);

//           setName("");

//           setEmail("");

//           setPassword("");

//           setRole("user");
//         }

//         // =================================
//         // LOGIN
//         // =================================

//         else {
//           if (
//             !email ||
//             !password
//           ) {
//             setAuthError(
//               "Please enter email and password"
//             );

//             setAuthLoading(false);

//             return;
//           }

//           const response =
//             await axios.post(
//               "http://localhost:5000/api/auth/login",
//               {
//                 email,
//                 password,
//                 role
//               }
//             );

//           localStorage.setItem(
//             "token",
//             response.data.token
//           );

//           localStorage.setItem(
//             "user",
//             JSON.stringify(
//               response.data.user
//             )
//           );

//           await fetchCurrentUser();

//           window.dispatchEvent(
//             new Event("authChange")
//           );

//           setLoginOpen(false);

//           setEmail("");

//           setPassword("");

//           setRole("user");
//         }
//       } catch (error) {
//         console.log(error);

//         setAuthError(
//           error.response?.data
//             ?.message ||
//             "Something went wrong"
//         );
//       } finally {
//         setAuthLoading(false);
//       }
//     };

//   return (
//     <>
//       <nav className="navbar">

//         {/* LOGO */}

//         <Link
//           to="/"
//           className="logo"
//           aria-label="HomeEstate home"
//         >
//           <img src={brandLogo} alt="HomeEstate" />
//         </Link>

//         {/* DESKTOP NAVIGATION */}

//         <div className="nav-links">
//           {navItems.map((item) => (
//             <Link key={item.to} to={item.to}>
//               {item.label}
//             </Link>
//           ))}
//         </div>

//         {/* RIGHT SIDE */}

//         <div className="nav-actions">

//           {/* FAVOURITES */}

//           <Link
//             to="/favourites"
//             className="favorite-nav"
//             title="My Favourites"
//           >
//             ♡
//           </Link>

//           {/* POST PROPERTY */}

//            {user?.role === "owner" && (
//   <Link
//     to="/owner-dashboard"
//     className="owner-dashboard-btn"
//   >
//     Dashboard
//   </Link>
// )}

//           {user?.role ===
//             "owner" && (
//             <Link
//               to="/post-property"
//               className="post-property-btn"
//             >
//               + Post Property
//             </Link>
//           )}

//           {/* LOGIN / LOGOUT */}

//           {user ? (
//             <>
//               <span className="nav-user-name">
//                 Hi, {user.name}
//               </span>

//               <button
//                 className="login-btn"
//                 onClick={
//                   handleLogout
//                 }
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <button
//               className="login-btn"
//               onClick={
//                 openLogin
//               }
//             >
//               Login / Register
//             </button>
//           )}

//         </div>

//         {/* MOBILE MENU BUTTON */}

//         <button
//           className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
//           type="button"
//           aria-label={menuOpen ? "Close menu" : "Open menu"}
//           aria-expanded={menuOpen}
//           onClick={() =>
//             setMenuOpen(
//               !menuOpen
//             )
//           }
//         >
//           <span className="menu-mark" aria-hidden="true">
//             <i />
//             <i />
//           </span>
//           <span>{menuOpen ? "Close" : "Menu"}</span>
//         </button>

//       </nav>

//       {/* MOBILE MENU */}

//       {menuOpen && (
//         <div className="mobile-nav">

//           <div className="menu-overlay-top">
//             <span>Explore HomeEstate</span>
//             <button
//               type="button"
//               className="menu-close"
//               aria-label="Close navigation"
//               onClick={() => setMenuOpen(false)}
//             >
//               Close <span aria-hidden="true">×</span>
//             </button>
//           </div>

//           {navItems.map((item) => (
//             <Link
//               key={item.to}
//               to={item.to}
//               onClick={() => setMenuOpen(false)}
//             >
//               {item.label}
//             </Link>
//           ))}

//           <Link
//             to="/favourites"
//             onClick={() =>
//               setMenuOpen(false)
//             }
//           >
//             Favourites
//           </Link>

//           {/* MOBILE POST PROPERTY */}

         

//           {user?.role ===
//             "owner" && (
//             <Link
//               to="/owner-dashboard"
//               className="mobile-post"
//               onClick={() => setMenuOpen(false)}
//             >
//               Owner Dashboard
//             </Link>
//           )}

//           {user?.role ===
//             "owner" && (
//             <Link
//               to="/post-property"
//               className="mobile-post"
//               onClick={() =>
//                 setMenuOpen(false)
//               }
//             >
//               + Post Property
//             </Link>
//           )}

//           {/* MOBILE LOGIN / LOGOUT */}

//           {user ? (
//             <button
//               className="mobile-login"
//               onClick={() => {
//                 handleLogout();

//                 setMenuOpen(
//                   false
//                 );
//               }}
//             >
//               Logout
//             </button>
//           ) : (
//             <button
//               className="mobile-login"
//               onClick={() => {
//                 setMenuOpen(
//                   false
//                 );

//                 openLogin();
//               }}
//             >
//               Login / Register
//             </button>
//           )}

//         </div>
//       )}

//       {/* LOGIN / REGISTER MODAL */}

//       {loginOpen && (
//         <div
//           className="modal-overlay"
//           onClick={() =>
//             setLoginOpen(false)
//           }
//         >

//           <div
//             className="login-modal"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >

//             {/* CLOSE */}

//             <button
//               className="close-modal"
//               onClick={() =>
//                 setLoginOpen(false)
//               }
//             >
//               ✕
//             </button>

//             {/* TITLE */}

//             <h2>
//               {isRegister
//                 ? "Create Account"
//                 : "Welcome Back"}
//             </h2>

//             {/* SUBTITLE */}

//             <p className="modal-subtitle">
//               {isRegister
//                 ? "Create your HomeEstate account"
//                 : "Login to continue"}
//             </p>

//             {/* ERROR */}

//             {authError && (
//               <p className="auth-error">
//                 {authError}
//               </p>
//             )}

//             {/* REGISTER NAME */}

//             {isRegister && (
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 className="modal-input"
//                 value={name}
//                 onChange={(e) =>
//                   setName(
//                     e.target.value
//                   )
//                 }
//               />
//             )}

//             {/* EMAIL */}

//             <input
//               type="email"
//               placeholder="Email Address"
//               className="modal-input"
//               value={email}
//               onChange={(e) =>
//                 setEmail(
//                   e.target.value
//                 )
//               }
//             />

//             {/* PASSWORD */}

//             <input
//               type="password"
//               placeholder="Password"
//               className="modal-input"
//               value={password}
//               onChange={(e) =>
//                 setPassword(
//                   e.target.value
//                 )
//               }
//             />

//             {/* ROLE */}

//             <select
//               className="modal-input"
//               value={role}
//               onChange={(e) =>
//                 setRole(
//                   e.target.value
//                 )
//               }
//             >
//               {isRegister ? (
//                 <>
//                   <option value="user">
//                     Register as User
//                   </option>

//                   <option value="owner">
//                     Register as Owner
//                   </option>
//                 </>
//               ) : (
//                 <>
//                   <option value="user">
//                     Login as User
//                   </option>

//                   <option value="owner">
//                     Login as Owner
//                   </option>
//                 </>
//               )}
//             </select>

//             {!isRegister && (
//               <button
//                 type="button"
//                 className="demo-owner-btn"
//                 onClick={() => {
//                   setEmail(DEMO_OWNER.email);
//                   setPassword(DEMO_OWNER.password);
//                   setRole(DEMO_OWNER.role);
//                   applyDemoOwnerSession();
//                 }}
//               >
//                 Demo Owner Login
//               </button>
//             )}

//             {/* SUBMIT */}

//             <button
//               className="modal-submit"
//               onClick={
//                 handleAuth
//               }
//               disabled={
//                 authLoading
//               }
//             >
//               {authLoading
//                 ? "Please wait..."
//                 : isRegister
//                 ? "Create Account"
//                 : "Login"}
//             </button>

//             {/* SWITCH */}

//             <p className="switch-auth">

//               {isRegister
//                 ? "Already have an account?"
//                 : "Don't have an account?"}

//               <button
//                 onClick={() => {
//                   setIsRegister(
//                     !isRegister
//                   );

//                   setAuthError("");

//                   setRole("user");
//                 }}
//               >
//                 {isRegister
//                   ? " Login"
//                   : " Register"}
//               </button>

//             </p>

//           </div>

//         </div>
//       )}
//     </>
//   );
// }

// export default Navbar;

import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import brogetLogo from "../../images/Glossy BuilderBroget 3D Logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const response = await axios.get(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const currentUser = response.data.user;

      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));

      return currentUser;
    } catch (error) {
      console.error(
        "Failed to fetch current user:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }

      return null;
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    const handleAuthChange = () => {
      fetchCurrentUser();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [fetchCurrentUser]);

  const openLogin = () => {
    setLoginOpen(true);
    setIsRegister(false);
    setAuthError("");
    setRole("user");
  };

  // =====================================
  // LOGOUT
  // =====================================
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");

  //   setUser(null);
  //   setLoginOpen(false);
  //   setMenuOpen(false);

  //   window.dispatchEvent(new Event("authChange"));

  //   navigate("/", { replace: true });
  // };
  
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setUser(null);
  setLoginOpen(false);
  setMenuOpen(false);

  window.dispatchEvent(new Event("authChange"));

  toast.success("You have been logged out successfully!", {
    position: "top-right",
    autoClose: 2500,
  });

  navigate("/", { replace: true });
};

  const handleAuth = async (e) => {
    if (e) e.preventDefault();

    setAuthError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (isRegister && (!cleanName || !cleanEmail || !password)) {
      setAuthError("Please fill all fields.");
      return;
    }

    if (!isRegister && (!cleanEmail || !password)) {
      setAuthError("Please enter email and password.");
      return;
    }

    if (isRegister && password.length < 8) {
      setAuthError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setAuthLoading(true);

      let response;
      if (isRegister) {
        response = await axios.post(
          `${API_URL}/auth/register`,
          {
            name: cleanName,
            email: cleanEmail,
            password,
            role,
          }
        );
      } else {
        response = await axios.post(
          `${API_URL}/auth/login`,
          {
            email: cleanEmail,
            password,
            role,
          }
        );
      }

      const authToken = response.data.token;
      let authUser = response.data.user;

      if (!authToken || !authUser) {
        throw new Error("The server returned an incomplete authentication response.");
      }

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(authUser));

      setUser(authUser);
      setLoginOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setAuthError("");

      window.dispatchEvent(new Event("authChange"));
      toast.success(
  isRegister
    ? "Account created successfully!"
    : `Login successful! Welcome back, ${authUser.name || "to BuilderBroget"}!`,
  {
    position: "top-right",
    autoClose: 2500,
  }
);

      if (authUser.role === "superadmin") {
        navigate("/super-admin", { replace: true });
        return;
      }

      if (authUser.role === "owner") {
        const latestUser = await fetchCurrentUser();

        if (latestUser) {
          authUser = latestUser;
        }

        if (authUser.approvalStatus === "approved") {
          navigate("/owner-dashboard", { replace: true });
        } else {
          navigate("/owner-application-status", {
            replace: true,
          });
        }

        return;
      }

      // Customer registration/login
      navigate("/", { replace: true });
    // } catch (error) {
    //   // console.error(
    //   //   "Authentication error:",
    //   //   error.response?.data || error.message
    //   // );

    //   // setAuthError(
    //   //   error.response?.data?.message ||
    //   //     error.message ||
    //   //     "Something went wrong. Please try again."
    //   // );
    // } finally {
    //   setAuthLoading(false);
    // }
    
} catch (error) {
  console.error(
    "Authentication error:",
    error.response?.data || error.message
  );

  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong. Please try again.";

  setAuthError(errorMessage);

  if (!isRegister && error.response?.status === 401) {
    toast.error("Invalid email or password. Please try again.", {
      position: "top-right",
      autoClose: 3000,
    });
  } else {
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 3000,
    });
  }
} finally {
  setAuthLoading(false);
}

  };

  const isApprovedOwner =
    user?.role === "owner" &&
    user?.approvalStatus === "approved";

  const needsOwnerReview =
    user?.role === "owner" &&
    user?.approvalStatus !== "approved";

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo" aria-label="HomeEstate home">
          <img src={brogetLogo} alt="BuilderBroget, India's Smart Builder Platform" />
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/buy">Buy</Link>
          <Link to="/rent">Rent</Link>
          <Link to="/pg">PG</Link>
          <Link to="/new-projects">New Projects</Link>
           <Link to="/property-news">Property News</Link>
           <Link to="/about-us">About Us</Link>
          <Link to="/contact-us">Contact US</Link>
         
        </div>

        <div className="nav-actions">
          <Link
            to="/favourites"
            className="favorite-nav"
            title="My Favourites"
          >
            ♡
          </Link>

          {isApprovedOwner && (
            <Link
              to="/owner-dashboard"
              className="owner-dashboard-btn"
            >
              Dashboard
            </Link>
          )}

          {isApprovedOwner && (
            <Link
              to="/post-property"
              className="post-property-btn"
            >
              + Post Property
            </Link>
          )}

          {needsOwnerReview && (
            <Link
              to="/owner-application-status"
              className="owner-dashboard-btn"
            >
              Application Status
            </Link>
          )}

          {user?.role === "superadmin" && (
            <Link
              to="/super-admin"
              className="owner-dashboard-btn"
            >
              Super Admin
            </Link>
          )}

          {user ? (
            <>
              <span className="nav-user-name">
                Hi, {user.name}
              </span>

              <button
                type="button"
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className="login-btn"
              onClick={openLogin}
            >
              Login / Register
            </button>
          )}
        </div>

        <button
          type="button"
          className="mobile-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-nav">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/buy" onClick={() => setMenuOpen(false)}>
            Buy
          </Link>

          <Link to="/rent" onClick={() => setMenuOpen(false)}>
            Rent
          </Link>

          <Link to="/pg" onClick={() => setMenuOpen(false)}>
            PG
          </Link>

          <Link
            to="/new-projects"
            onClick={() => setMenuOpen(false)}
          >
            New Projects
          </Link>

          <Link
            to="/property-news"
            onClick={() => setMenuOpen(false)}
          >
            Property News
          </Link>

           <Link
            to="/about-us"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>

          <Link
            to="/contact-us"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>

          <Link
            to="/favourites"
            onClick={() => setMenuOpen(false)}
          >
            Favourites
          </Link>

          {isApprovedOwner && (
            <>
              <Link
                to="/owner-dashboard"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/post-property"
                className="mobile-post"
                onClick={() => setMenuOpen(false)}
              >
                Post Property
              </Link>
            </>
          )}

          {needsOwnerReview && (
            <Link
              to="/owner-application-status"
              onClick={() => setMenuOpen(false)}
            >
              Application Status
            </Link>
          )}

          {user?.role === "superadmin" && (
            <Link
              to="/super-admin"
              onClick={() => setMenuOpen(false)}
            >
              Super Admin Panel
            </Link>
          )}

          {user ? (
            <button
              type="button"
              className="mobile-login"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="mobile-login"
              onClick={() => {
                setMenuOpen(false);
                openLogin();
              }}
            >
              Login / Register
            </button>
          )}
        </div>
      )}

      {loginOpen && (
        <div
          className="modal-overlay"
          onClick={() => setLoginOpen(false)}
        >
          <div
            className="login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="close-modal"
              onClick={() => setLoginOpen(false)}
              aria-label="Close login modal"
            >
              ✕
            </button>

            <h2>
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>

            <p className="modal-subtitle">
              {isRegister
                ? "Create your BuilderBroget account"
                : "Login to continue"}
            </p>

            <form onSubmit={handleAuth}>
              {isRegister && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="modal-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                className="modal-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="modal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                minLength={isRegister ? 8 : undefined}
                required
              />

              <select
                className="modal-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Account type"
                required
              >
                {isRegister ? (
                  <>
                    <option value="user">Register as User</option>
                    <option value="owner">Register as Owner</option>
                  </>
                ) : (
                  <>
                    <option value="user">Login as User</option>
                    <option value="owner">Login as Owner</option>
                    <option value="superadmin">
                      Login as Super Admin
                    </option>
                  </>
                )}
              </select>

              {isRegister && role === "owner" && (
                <p className="modal-subtitle">
                  Owner applications require Super Admin approval.
                  You will be notified on the application-status page.
                </p>
              )}

              <button
                type="submit"
                className="modal-submit"
                disabled={authLoading}
              >
                {authLoading
                  ? "Please wait..."
                  : isRegister
                  ? "Create Account"
                  : "Login"}
              </button>
            </form>

            <p className="switch-auth">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                type="button"
                onClick={() => {
                  setIsRegister((prev) => !prev);
                  setAuthError("");
                  setRole("user");
                }}
              >
                {isRegister ? " Login" : " Register"}
              </button>
            </p>
          </div>
        </div>
      )}
       <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default Navbar;