

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [properties, setProperties] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/owner/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        setOwner(data.owner || null);
        setStatistics(data.statistics || {});
        setProperties(
          Array.isArray(data.properties) ? data.properties : []
        );
        setRecentVisitors(
          Array.isArray(data.recentVisitors) ? data.recentVisitors : []
        );
        setRecentCustomers(
          Array.isArray(data.recentCustomers) ? data.recentCustomers : []
        );
      } catch (err) {
        console.error("Error fetching owner dashboard:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load the dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Show registered customers only.
  // Exclude owners and superadmins.
  const registeredUsers = recentVisitors.filter(
    (user) =>
      user.role !== "owner" &&
      user.role !== "superadmin"
  );

  if (loading) {
    return (
      <div className="owner-dashboard">
        <div className="dashboard-loading">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-dashboard">
        <div className="dashboard-error">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">OWNER CONTROL CENTER</p>

          <h1>
            Welcome, {owner?.name || "Property Owner"}!
          </h1>

          <p>
            Manage your properties and keep track of your customers.
          </p>
        </div>

        <Link to="/post-property" className="dashboard-add-btn">
          + Add Property
        </Link>
      </div>

      {/* Dashboard Statistics */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-icon">🏠</span>
          <div>
            <h3>Total Properties</h3>
            <p>{statistics.totalProperties ?? properties.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div>
            <h3>Registered Users</h3>
            <p>
              {statistics.registeredUsers ?? registeredUsers.length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📲</span>
          <div>
            <h3>Customer Enquiries</h3>
            <p>
              {statistics.totalCustomers ?? recentCustomers.length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">❤️</span>
          <div>
            <h3>Total Favourites</h3>
            <p>{statistics.totalFavourites ?? 0}</p>
          </div>
        </div>
      </section>

      {/* My Properties */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="section-label">YOUR LISTINGS</p>
            <h2>My Properties</h2>
          </div>

          <Link to="/post-property" className="section-link">
            + Add New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="dashboard-empty">
            <span>🏡</span>
            <h3>No properties listed yet</h3>
            <p>
              Your next great listing could start right here.
            </p>

            <Link to="/post-property" className="dashboard-add-btn">
              Post Your First Property
            </Link>
          </div>
        ) : (
          <div className="dashboard-property-grid">
            {properties.map((property) => {
              const image =
                Array.isArray(property.images) &&
                property.images.length > 0
                  ? property.images[0]
                  : "https://placehold.co/600x400?text=Property";

              return (
                <div
                  className="dashboard-property-card"
                  key={property._id}
                >
                  <img
                    src={image}
                    alt={property.title || "Property"}
                    className="dashboard-property-image"
                  />

                  <div className="dashboard-property-info">
                    <span className="property-type-badge">
                      {property.listingType || "Property"}
                    </span>

                    <h3>
                      {property.title || "Untitled Property"}
                    </h3>

                    <p className="property-location">
                      📍 {property.city || "Location not specified"}
                    </p>

                    <p className="property-price">
                      ₹
                      {Number(property.price || 0).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <div className="property-features">
                      {property.bedrooms != null && (
                        <span>🛏️ {property.bedrooms} Beds</span>
                      )}

                      {property.bathrooms != null && (
                        <span>🚿 {property.bathrooms} Baths</span>
                      )}
                    </div>

                    <Link
                      to={`/property/${property._id}`}
                      className="dashboard-view-btn"
                    >
                      View Property
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Registered Users — only one section */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="section-label">WEBSITE ACTIVITY</p>
            <h2>Registered Users</h2>
            <p>
              Customers who have registered on HomeEstate.
            </p>
          </div>

          <span className="section-count">
            {registeredUsers.length} Users
          </span>
        </div>

        {registeredUsers.length === 0 ? (
          <div className="dashboard-empty">
            <span>👥</span>
            <h3>No registered users to display</h3>
            <p>
              Registered customer activity will appear here when available.
            </p>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered / Activity Date</th>
                </tr>
              </thead>

              <tbody>
                {registeredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="dashboard-user">
                        <div className="user-avatar">
                          {(user.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span>{user.name || "Unknown User"}</span>
                      </div>
                    </td>

                    <td>{user.email || "Not provided"}</td>

                    <td>
                      <span className="user-role-badge">
                        {user.role || "user"}
                      </span>
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(
                            "en-IN"
                          )
                        : user.lastVisited
                        ? new Date(
                            user.lastVisited
                          ).toLocaleDateString("en-IN")
                        : "Not available"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Customers / WhatsApp Leads */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="section-label">CUSTOMER ENQUIRIES</p>
            <h2>Recent Customers / WhatsApp Leads</h2>
            <p>
              People who have contacted you about your properties.
            </p>
          </div>

          <span className="section-count">
            {recentCustomers.length} Leads
          </span>
        </div>

        {recentCustomers.length === 0 ? (
          <div className="dashboard-empty">
            <span>📲</span>
            <h3>No customer enquiries yet</h3>
            <p>
              New customer enquiries will appear here when available.
            </p>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Property</th>
                  <th>Enquiry Date</th>
                </tr>
              </thead>

              <tbody>
                {recentCustomers.map((customer, index) => (
                  <tr key={customer._id || index}>
                    <td>
                      <div className="dashboard-user">
                        <div className="user-avatar">
                          {(customer.name || "C")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span>
                          {customer.name || "Unknown Customer"}
                        </span>
                      </div>
                    </td>

                    <td>{customer.phone || "Not provided"}</td>

                    <td>
                      {customer.propertyTitle ||
                        customer.property?.title ||
                        "Property enquiry"}
                    </td>

                    <td>
                      {customer.createdAt
                        ? new Date(
                            customer.createdAt
                          ).toLocaleDateString("en-IN")
                        : "Not available"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default OwnerDashboard;
