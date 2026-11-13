
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import PropertyCard from "../components/PropertyCard";
import "./PropertiesPage.css";

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_URL}/properties`);

        const data = response.data;

        const allProperties = Array.isArray(data)
          ? data
          : data.properties || data.data || [];

        setProperties(allProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []);

  const sortedProperties = useMemo(() => {
    const result = [...properties];

    if (sort === "low") {
      result.sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (sort === "high") {
      result.sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [properties, sort]);

  return (
    <main className="all-properties-page">

      <section className="all-properties-header">
        <div className="all-properties-eyebrow">
          <span>BUILDER BROGET</span>
          <span className="all-properties-line"></span>
        </div>

        <h1>
          Explore All <span>Properties</span>
        </h1>

        <p>
          Discover your perfect home from our collection of properties.
        </p>

        <div className="all-properties-count">
          {loading
            ? "Loading properties..."
            : `${properties.length} Properties Available`}
        </div>
      </section>

      <section className="all-properties-content">

        <div className="all-properties-toolbar">
          <h2>All Properties</h2>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="newest">Newest First</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {loading && (
          <div className="all-properties-loading">
            Loading properties...
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="all-properties-empty">
            <h3>No Properties Found</h3>
            <p>Please check back later for available properties.</p>
          </div>
        )}

        {!loading && properties.length > 0 && (
  <div className="property-grid all-properties-grid">
    {sortedProperties.map((property) => (
      <PropertyCard
        key={property._id}
        property={property}
      />
    ))}
  </div>
)}

      </section>
    </main>
  );
}

export default PropertiesPage;
