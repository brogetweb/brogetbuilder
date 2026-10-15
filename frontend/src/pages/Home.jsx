import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import WhatsAppChatbot from "../components/WhatsAppChatbot";
import starryHouseImage from "../../images/Futuristic House Under a Starry Sky.png";

import OwnersSection from "../components/OwnersSection";
import Testimonials from "./Testimonials";

function Home({ listingType }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");

  const fetchProperties = async (filters = {}) => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/properties",
        {
          params: filters
        }
      );

      setProperties(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSort("");

    const filters = {};

    if (listingType) {
      filters.listingType = listingType;
    }

    fetchProperties(filters);
  }, [listingType]);

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

  const handleSearch = (filters) => {
    fetchProperties(filters);
  };

  return (
    <div>

      {/* ================= HERO ================= */}

      <section
        className="hero"
        style={{ "--hero-image": `url("${starryHouseImage}")` }}
      >

        <div className="hero-content">

          <SearchBar
            onSearch={handleSearch}
          />

          <div className="hero-brand-copy">
            <h1 className="hero-brand-title">BROGET HOME ESTATE</h1>
            <p className="hero-brand-tagline">
              — Where Your Dream Home Becomes Reality.
            </p>
          </div>

        </div>

      </section>


      {/* ================= QUICK SECTION ================= */}

      {!listingType && (
        <section className="quick-section home-quick-section">

          <h2>
            Explore Properties
          </h2>

          <div className="quick-grid">

            <div
              onClick={() =>
                fetchProperties({
                  listingType: "Buy"
                })
              }
            >
              🏠
              <span>
                Buy
              </span>
            </div>

            <div
              onClick={() =>
                fetchProperties({
                  listingType: "Rent"
                })
              }
            >
              🔑
              <span>
                Rent
              </span>

            </div>

            <div
              onClick={() =>
                fetchProperties({
                  propertyType: "Apartment"
                })
              }
            >
              🏢
              <span>
                Apartments
              </span>
            </div>

            <div
              onClick={() =>
                fetchProperties({
                  propertyType: "Villa"
                })
              }
            >
              🏡
              <span>
                Villas
              </span>
            </div>

            <div
              onClick={() =>
                fetchProperties({
                  propertyType: "Plot"
                })
              }
            >
              📐
              <span>
                Plots
              </span>
              
            </div>
             <div
              onClick={() =>
                fetchProperties({
                  propertyType: "Builder-Floors"
                })
              }
            >
              🏬
              <span>
                Builder Floors
              </span>
            </div>
          </div>

        </section>
      )}

      <OwnersSection />




      {/* ================= PROPERTIES ================= */}

      <section className="properties-section">

        <div className="section-header">

          <div>

            <h2>
              {listingType
                ? `${listingType} Properties`
                : "All Properties"}
            </h2>

            <p>
              {properties.length} properties found
            </p>

          </div>


          <div className="sorting">

            <select
              value={sort}
              onChange={(e) =>
                handleSort(e.target.value)
              }
            >

              <option value="">
                Sort By
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

            </select>


            <button
              onClick={resetSearch}
            >
              Reset
            </button>

          </div>

        </div>


        {loading && (
          <div className="loading">
            Loading properties...
          </div>
        )}


        {!loading &&
          properties.length === 0 && (
            <div className="no-properties">

              <h3>
                No properties found
              </h3>

              <p>
                Try changing your search filters.
              </p>

              <button
                onClick={resetSearch}
              >
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


      {/* ================= POPULAR CITIES ================= */}

      <section className="cities-section">

        <h2>
          Popular Cities
        </h2>

        <div className="city-grid">

          <button
            onClick={() =>
              fetchProperties({
                city: "Aurangabad"
              })
            }
          >
            Aurangabad
          </button>

          <button
            onClick={() =>
              fetchProperties({
                city: "Mumbai"
              })
            }
          >
            Mumbai
          </button>

          <button
            onClick={() =>
              fetchProperties({
                city: "Pune"
              })
            }
          >
            Pune
          </button>

          <button
            onClick={() =>
              fetchProperties({
                city: "Nashik"
              })
            }
          >
            Nashik
          </button>

        </div>

      </section>


      {/* ================================================= */}
      {/*                  ABOUT US PREVIEW                 */}
      {/* ================================================= */}

      <section className="home-about-preview">

        <div className="home-about-content">

          <span className="section-label">
            ABOUT HOMEESTATE
          </span>

          <h2>
            Making Property Search
            <span>
              {" "}Simple & Convenient
            </span>
          </h2>

          <p>
            HomeEstate is a modern real-estate
            platform designed to make finding
            your perfect property simple and
            convenient.
          </p>

          <p>
            Explore apartments, villas, plots,
            independent houses and more in your
            preferred location.
          </p>

          <Link
            to="/about"
            className="home-section-btn"
          >
            Learn More
          </Link>

        </div>


        <div className="home-about-image">

          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900"
            alt="Modern Home"
          />

        </div>

      </section>


      {/* ================================================= */}
      {/*                WHY CHOOSE US PREVIEW              */}
      {/* ================================================= */}

      <section className="home-why-preview">

        <div className="home-why-heading">

          <span className="section-label">
            WHY CHOOSE US
          </span>

          <h2>
            Why Choose HomeEstate?
          </h2>

          <p>
            We make your property search
            easier, faster and more convenient.
          </p>

        </div>


        <div className="home-why-grid">

          <div className="home-why-card">

            <div className="home-why-icon">
              ✓
            </div>

            <h3>
              Verified Properties
            </h3>

            <p>
              Discover verified property
              listings and search with
              greater confidence.
            </p>

          </div>


          <div className="home-why-card">

            <div className="home-why-icon">
              🔍
            </div>

            <h3>
              Smart Search
            </h3>

            <p>
              Find properties using location,
              price, property type and other
              useful filters.
            </p>

          </div>


          <div className="home-why-card">

            <div className="home-why-icon">
              🏠
            </div>

            <h3>
              Wide Range
            </h3>

            <p>
              Explore apartments, villas,
              plots, houses and more.
            </p>

          </div>


          <div className="home-why-card">

            <div className="home-why-icon">
              🤝
            </div>

            <h3>
              Easy to Connect
            </h3>

            <p>
              Discover properties that
              match your requirements.
            </p>

          </div>

        </div>


        <Link
          to="/why-choose-us"
          className="home-section-btn"
        >
          Explore More
        </Link>

      </section>
       <WhatsAppChatbot />
       <Testimonials/>

    </div>
  );
}

export default Home;