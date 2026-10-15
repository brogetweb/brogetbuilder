import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

import PropertyCard from "./PropertyCard";

function PropertyCategory({ title, propertyType }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");

  const fetchProperties = async (sortValue = "") => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/properties`,
        {
          params: {
            propertyType,
            sort: sortValue
          }
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
    fetchProperties();
  }, [propertyType]);

  const handleSort = (value) => {
    setSort(value);
    fetchProperties(value);
  };

  const resetSort = () => {
    setSort("");
    fetchProperties();
  };

  return (
    <div className="category-page">

      {/* CATEGORY HERO */}
      <section className="category-hero">
        <div className="category-hero-content">

          <span className="section-label">
            HOMEESTATE
          </span>

          <h1>
            {title}
          </h1>

          <p>
            Explore the best {title.toLowerCase()}
            available on HomeEstate.
          </p>

        </div>
      </section>

      {/* PROPERTY LIST */}
      <section className="category-properties">

        <div className="category-header">

          <div>
            <h2>
              {title} for Sale & Rent
            </h2>

            <p>
              {properties.length} properties found
            </p>
          </div>

          <div className="category-sort">

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

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="area-low">
                Area: Low to High
              </option>

              <option value="area-high">
                Area: High to Low
              </option>

            </select>

            <button onClick={resetSort}>
              Reset
            </button>

          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="loading">
            Loading {title.toLowerCase()}...
          </div>
        )}

        {/* NO PROPERTIES */}
        {!loading && properties.length === 0 && (
          <div className="no-properties">

            <h3>
              No {title.toLowerCase()} found
            </h3>

            <p>
              There are currently no properties
              available in this category.
            </p>

          </div>
        )}

        {/* PROPERTY CARDS */}
        {!loading && properties.length > 0 && (
          <div className="property-grid">

            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
              />
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default PropertyCategory;