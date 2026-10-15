import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import axios from "axios";
import { API_URL } from "../config";

function Footer() {
  const [user, setUser] = useState(null);

  // =====================================
  // GET CURRENT USER FROM DATABASE
  // =====================================

  const fetchCurrentUser = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      const response =
        await axios.get(
          `${API_URL}/auth/me`,
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
    } catch (error) {
      console.log(error);

      setUser(null);
    }
  };

  // =====================================
  // CHECK USER WHEN FOOTER LOADS
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

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* ABOUT */}

        <div className="footer-about">

          <h2 className="footer-logo">
            Home<span>Estate</span>
          </h2>

          <p>
            Find your dream property with
            HomeEstate. Explore properties for
            buying, renting and PG across
            different locations.
          </p>

          <div className="social-links">

            <a
              href="#"
              aria-label="Facebook"
            >
              f
            </a>

            <a
              href="#"
              aria-label="Instagram"
            >
              ◎
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
            >
              in
            </a>

            <a
              href="#"
              aria-label="Twitter"
            >
              𝕏
            </a>

          </div>

        </div>

        {/* QUICK LINKS */}

        <div className="footer-column">

          <h3>Quick Links</h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/buy">
            Buy
          </Link>

          <Link to="/rent">
            Rent
          </Link>

          <Link to="/pg">
            PG
          </Link>

          <Link to="/new-projects">
            New Projects
          </Link>

        </div>

        {/* PROPERTY TYPES */}

        <div className="footer-column">

          <h3>Property Types</h3>

          <Link to="/apartments">
            Apartments
          </Link>

          <Link to="/villas">
            Villas
          </Link>

          <Link to="/plots">
            Plots
          </Link>

          <Link to="/independent-houses">
            Independent Houses
          </Link>

          <Link to="/builder-floors">
            Builder Floors
          </Link>

        </div>

        {/* HOMEESTATE */}

        <div className="footer-column">

          <h3>HomeEstate</h3>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/why-choose-us">
            Why Choose Us
          </Link>

          <Link to="/favourites">
            Favourites
          </Link>

          {/* POST PROPERTY
              ONLY OWNER CAN SEE */}

          {user?.role === "owner" && (
            <Link to="/post-property">
              Post Property
            </Link>
          )}

        </div>

        {/* CONTACT */}

        <div className="footer-column">

          <h3>Contact Us</h3>

          <p>
            📍 India
          </p>

          <p>
            📧 support@homeestate.com
          </p>

          <p>
            📞 +91 XXXXX XXXXX
          </p>

        </div>

      </div>

      {/* FOOTER BOTTOM */}

      <div className="footer-bottom">

        <p>
          © 2026 HomeEstate.
          All rights reserved.
        </p>

        <div>

          <Link to="/">
            Privacy Policy
          </Link>

          <Link to="/">
            Terms & Conditions
          </Link>

        </div>

      </div>

    </footer>
  );
}

export default Footer;