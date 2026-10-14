
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";

function OwnerProperties() {
  const { ownerId } = useParams();

  const [owner, setOwner] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnerProperties = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `http://localhost:5000/api/public/owners/${ownerId}/properties`
        );

        setOwner(response.data.owner);
        setProperties(response.data.properties || []);
      } catch (err) {
        console.error("Error fetching owner properties:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load this owner's properties."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProperties();
  }, [ownerId]);

  if (loading) {
    return (
      <main className="owner-properties-page">
        <p>Loading owner properties...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="owner-properties-page">
        <Link to="/" className="back-home-link">
          ← Back to Home
        </Link>
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="owner-properties-page">
      <Link to="/" className="back-home-link">
        ← Back to Home
      </Link>

      <section className="owner-profile-banner">
        <div className="owner-profile-avatar">
          {owner?.name?.charAt(0).toUpperCase() || "O"}
        </div>

        <div>
          <span className="owner-profile-label">
            PROPERTY COLLECTION
          </span>

          <h1>{owner?.name}</h1>

          <p>
            Explore properties listed by this registered owner.
          </p>
        </div>

        <div className="owner-total">
          <strong>{properties.length}</strong>
          <span>
            {properties.length === 1 ? "Property" : "Properties"}
          </span>
        </div>
      </section>

      <section className="owner-listings">
        <div className="owner-listings-heading">
          <div>
            <h2>Properties by {owner?.name}</h2>
            <p>Find a property that feels like home.</p>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="owner-empty-state">
            <div className="empty-house">⌂</div>
            <h3>No properties listed yet</h3>
            <p>
              This owner has not linked any properties to
              their account yet.
            </p>

            <Link to="/" className="back-home-button">
              Explore All Properties
            </Link>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
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

export default OwnerProperties;