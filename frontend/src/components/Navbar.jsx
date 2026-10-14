import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import axios from "axios";
import brandLogo from "../assets/brand-logo.svg";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Buy", to: "/buy" },
  { label: "Rent", to: "/rent" },
  { label: "PG", to: "/pg" },
  { label: "New Projects", to: "/new-projects" },
  { label: "Apartments", to: "/apartments" },
  { label: "Villas", to: "/villas" },
  { label: "Plots", to: "/plots" },
  { label: "Independent Houses", to: "/independent-houses" },
  { label: "Builder Floors", to: "/builder-floors" },
  { label: "Property News", to: "/property-news" },
  { label: "Contact Us", to: "/contact-us" },
  { label: "About Us", to: "/about-us" }
];

function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loginOpen, setLoginOpen] =
    useState(false);

  const [isRegister, setIsRegister] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("user");

  const [authError, setAuthError] =
    useState("");

  const [authLoading, setAuthLoading] =
    useState(false);

  const DEMO_OWNER = {
    name: "Demo Owner",
    email: "owner@homeestate.com",
    password: "Owner@123",
    role: "owner"
  };

  const applyDemoOwnerSession = () => {
    const demoUser = {
      id: "demo-owner",
      name: DEMO_OWNER.name,
      email: DEMO_OWNER.email,
      role: DEMO_OWNER.role
    };

    localStorage.setItem(
      "token",
      "demo-owner-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify(demoUser)
    );

    setUser(demoUser);
    setLoginOpen(false);
    setName("");
    setEmail("");
    setPassword("");
    setRole("owner");
    window.dispatchEvent(
      new Event("authChange")
    );
    window.location.href = "/owner-dashboard";
  };

  // =====================================
  // GET USER FROM DATABASE
  // =====================================

  const fetchCurrentUser =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          setUser(null);
          return;
        }

        if (token === "demo-owner-token") {
          const savedUser = JSON.parse(
            localStorage.getItem("user") || "null"
          );
          setUser(savedUser);
          return;
        }

        const response =
          await axios.get(
            "http://localhost:5000/api/auth/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setUser(
          response.data.user
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );
      } catch (error) {
        console.log(error);

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        setUser(null);
      }
    };

  // =====================================
  // CHECK USER WHEN NAVBAR LOADS
  // =====================================

  useEffect(() => {
    fetchCurrentUser();

    window.addEventListener(
      "authChange",
      fetchCurrentUser
    );

    return () => {
      window.removeEventListener(
        "authChange",
        fetchCurrentUser
      );
    };
  }, []);

  // =====================================
  // OPEN LOGIN
  // =====================================

  const openLogin = () => {
    setLoginOpen(true);

    setIsRegister(false);

    setAuthError("");

    setRole("user");
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);

    window.dispatchEvent(
      new Event("authChange")
    );

    window.location.href = "/";
  };

  // =====================================
  // LOGIN / REGISTER
  // =====================================

  const handleAuth =
    async () => {
      try {
        setAuthError("");

        setAuthLoading(true);

        const normalizedEmail =
          String(email || "").trim().toLowerCase();

        if (
          normalizedEmail ===
            DEMO_OWNER.email &&
          password === DEMO_OWNER.password &&
          role === DEMO_OWNER.role
        ) {
          applyDemoOwnerSession();
          return;
        }

        // =================================
        // REGISTER
        // =================================

        if (isRegister) {
          if (
            !name ||
            !email ||
            !password
          ) {
            setAuthError(
              "Please fill all fields"
            );

            setAuthLoading(false);

            return;
          }

          const response =
            await axios.post(
              "http://localhost:5000/api/auth/register",
              {
                name,
                email,
                password,
                role
              }
            );

          localStorage.setItem(
            "token",
            response.data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              response.data.user
            )
          );

          await fetchCurrentUser();

          window.dispatchEvent(
            new Event("authChange")
          );

          setLoginOpen(false);

          setName("");

          setEmail("");

          setPassword("");

          setRole("user");
        }

        // =================================
        // LOGIN
        // =================================

        else {
          if (
            !email ||
            !password
          ) {
            setAuthError(
              "Please enter email and password"
            );

            setAuthLoading(false);

            return;
          }

          const response =
            await axios.post(
              "http://localhost:5000/api/auth/login",
              {
                email,
                password,
                role
              }
            );

          localStorage.setItem(
            "token",
            response.data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              response.data.user
            )
          );

          await fetchCurrentUser();

          window.dispatchEvent(
            new Event("authChange")
          );

          setLoginOpen(false);

          setEmail("");

          setPassword("");

          setRole("user");
        }
      } catch (error) {
        console.log(error);

        setAuthError(
          error.response?.data
            ?.message ||
            "Something went wrong"
        );
      } finally {
        setAuthLoading(false);
      }
    };

  return (
    <>
      <nav className="navbar">

        {/* LOGO */}

        <Link
          to="/"
          className="logo"
          aria-label="HomeEstate home"
        >
          <img src={brandLogo} alt="HomeEstate" />
        </Link>

        {/* DESKTOP NAVIGATION */}

        <div className="nav-links">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}

        <div className="nav-actions">

          {/* FAVOURITES */}

          <Link
            to="/favourites"
            className="favorite-nav"
            title="My Favourites"
          >
            ♡
          </Link>

          {/* POST PROPERTY */}

           {user?.role === "owner" && (
  <Link
    to="/owner-dashboard"
    className="owner-dashboard-btn"
  >
    Dashboard
  </Link>
)}

          {user?.role ===
            "owner" && (
            <Link
              to="/post-property"
              className="post-property-btn"
            >
              + Post Property
            </Link>
          )}

          {/* LOGIN / LOGOUT */}

          {user ? (
            <>
              <span className="nav-user-name">
                Hi, {user.name}
              </span>

              <button
                className="login-btn"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={
                openLogin
              }
            >
              Login / Register
            </button>
          )}

        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
        >
          <span className="menu-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>

      </nav>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div className="mobile-nav">

          <div className="menu-overlay-top">
            <span>Explore HomeEstate</span>
            <button
              type="button"
              className="menu-close"
              aria-label="Close navigation"
              onClick={() => setMenuOpen(false)}
            >
              Close <span aria-hidden="true">×</span>
            </button>
          </div>

          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/favourites"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Favourites
          </Link>

          {/* MOBILE POST PROPERTY */}

         

          {user?.role ===
            "owner" && (
            <Link
              to="/owner-dashboard"
              className="mobile-post"
              onClick={() => setMenuOpen(false)}
            >
              Owner Dashboard
            </Link>
          )}

          {user?.role ===
            "owner" && (
            <Link
              to="/post-property"
              className="mobile-post"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              + Post Property
            </Link>
          )}

          {/* MOBILE LOGIN / LOGOUT */}

          {user ? (
            <button
              className="mobile-login"
              onClick={() => {
                handleLogout();

                setMenuOpen(
                  false
                );
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="mobile-login"
              onClick={() => {
                setMenuOpen(
                  false
                );

                openLogin();
              }}
            >
              Login / Register
            </button>
          )}

        </div>
      )}

      {/* LOGIN / REGISTER MODAL */}

      {loginOpen && (
        <div
          className="modal-overlay"
          onClick={() =>
            setLoginOpen(false)
          }
        >

          <div
            className="login-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              className="close-modal"
              onClick={() =>
                setLoginOpen(false)
              }
            >
              ✕
            </button>

            {/* TITLE */}

            <h2>
              {isRegister
                ? "Create Account"
                : "Welcome Back"}
            </h2>

            {/* SUBTITLE */}

            <p className="modal-subtitle">
              {isRegister
                ? "Create your HomeEstate account"
                : "Login to continue"}
            </p>

            {/* ERROR */}

            {authError && (
              <p className="auth-error">
                {authError}
              </p>
            )}

            {/* REGISTER NAME */}

            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                className="modal-input"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
              />
            )}

            {/* EMAIL */}

            <input
              type="email"
              placeholder="Email Address"
              className="modal-input"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            {/* PASSWORD */}

            <input
              type="password"
              placeholder="Password"
              className="modal-input"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            {/* ROLE */}

            <select
              className="modal-input"
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
            >
              {isRegister ? (
                <>
                  <option value="user">
                    Register as User
                  </option>

                  <option value="owner">
                    Register as Owner
                  </option>
                </>
              ) : (
                <>
                  <option value="user">
                    Login as User
                  </option>

                  <option value="owner">
                    Login as Owner
                  </option>
                </>
              )}
            </select>

            {!isRegister && (
              <button
                type="button"
                className="demo-owner-btn"
                onClick={() => {
                  setEmail(DEMO_OWNER.email);
                  setPassword(DEMO_OWNER.password);
                  setRole(DEMO_OWNER.role);
                  applyDemoOwnerSession();
                }}
              >
                Demo Owner Login
              </button>
            )}

            {/* SUBMIT */}

            <button
              className="modal-submit"
              onClick={
                handleAuth
              }
              disabled={
                authLoading
              }
            >
              {authLoading
                ? "Please wait..."
                : isRegister
                ? "Create Account"
                : "Login"}
            </button>

            {/* SWITCH */}

            <p className="switch-auth">

              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                onClick={() => {
                  setIsRegister(
                    !isRegister
                  );

                  setAuthError("");

                  setRole("user");
                }}
              >
                {isRegister
                  ? " Login"
                  : " Register"}
              </button>

            </p>

          </div>

        </div>
      )}
    </>
  );
}

export default Navbar;