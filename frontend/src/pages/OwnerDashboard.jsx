import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import axios from "axios";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================================
     FETCH DASHBOARD
  ========================================================= */

  const fetchDashboard =
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "token"
          );

        if (token === "demo-owner-token") {
          const savedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
          );
          const properties = JSON.parse(
            localStorage.getItem("demoOwnerProperties") || "[]"
          );

          setDashboard({
            owner: { name: savedUser.name || "Demo Owner" },
            statistics: {
              totalProperties: properties.length,
              totalRegisteredUsers: 0,
              totalPropertyVisits: 0,
              totalCustomers: 0
            },
            properties,
            recentVisitors: [],
            recentCustomers: []
          });
          return;
        }

        if (!token) {
          navigate("/login");
          return;
        }

        const response =
          await axios.get(
            "http://localhost:5000/api/owner/dashboard",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setDashboard(
          response.data
        );
      } catch (error) {
        console.log(error);

        if (
          error.response?.status ===
          401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          return;
        }

        if (
          error.response?.status ===
          403
        ) {
          setError(
            "Only property owners can access this dashboard."
          );

          return;
        }

        setError(
          error.response?.data
            ?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     LOAD DASHBOARD
  ========================================================= */

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="owner-dashboard-loading">
        <div className="dashboard-spinner"></div>

        <p>
          Loading Owner Dashboard...
        </p>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="owner-dashboard-error">
        <div className="error-card">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Access Denied
          </h2>

          <p>
            {error}
          </p>

          <Link
            to="/"
            className="dashboard-home-btn"
          >
            Go Home
          </Link>

        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    owner,
    statistics,
    properties,
    recentVisitors,
    recentCustomers
  } = dashboard;

  return (
    <div className="owner-dashboard">

      {/* =====================================================
          DASHBOARD HEADER
      ===================================================== */}

      <section className="dashboard-header">

        <div>

          <span className="dashboard-label">
            {localStorage.getItem("token") === "demo-owner-token"
              ? "DEMO OWNER - LOCAL DATA"
              : "HOMEESTATE"}
          </span>

          <h1>
            Owner Dashboard
          </h1>

          <p>
            Welcome back,{" "}
            <strong>
              {owner.name}
            </strong>
            . Manage your properties
            and track your customers.
          </p>

        </div>

        <div className="dashboard-header-actions">

          <Link
            to="/post-property"
            className="dashboard-add-btn"
          >
            + Post Property
          </Link>

          <Link
            to="/"
            className="dashboard-home-link"
          >
            View Website
          </Link>

        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="dashboard-stats">

        {/* MY PROPERTIES */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            🏠
          </div>

          <div>

            <span>
              My Properties
            </span>

            <strong>
              {statistics.totalProperties}
            </strong>

          </div>

        </div>


        {/* REGISTERED USERS */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            👥
          </div>

          <div>

            <span>
              Registered Users
            </span>

            <strong>
              {
                statistics
                  .totalRegisteredUsers
              }
            </strong>

          </div>

        </div>


        {/* PROPERTY VISITS */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            👁️
          </div>

          <div>

            <span>
              Property Visits
            </span>

            <strong>
              {
                statistics
                  .totalPropertyVisits
              }
            </strong>

          </div>

        </div>


        {/* WHATSAPP ENQUIRIES */}

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            💬
          </div>

          <div>

            <span>
              WhatsApp Enquiries
            </span>

            <strong>
              {
                statistics
                  .totalCustomers
              }
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          MY PROPERTIES
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <span className="section-small-label">
              PROPERTY MANAGEMENT
            </span>

            <h2>
              My Properties
            </h2>

          </div>

          <span className="property-count">
            {properties.length} Properties
          </span>

        </div>


        {properties.length === 0 ? (

          <div className="dashboard-empty">

            <div className="empty-icon">
              🏠
            </div>

            <h3>
              No properties yet
            </h3>

            <p>
              Start by posting your
              first property.
            </p>

            <Link
              to="/post-property"
              className="dashboard-add-btn"
            >
              + Post Property
            </Link>

          </div>

        ) : (

          <div className="owner-property-grid">

            {properties.map(
              (property) => {

                const image =
                  property.images &&
                  property.images.length >
                    0
                    ? property.images[0]
                    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";

                return (

                 <div
                   className="owner-property-card"
                   key={property._id}
                 >

  <img
    src={
      property.images?.[0] ||
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
    }
    alt={property.title}
  />

  <div className="owner-property-content">

    <span className="property-type">
      {property.propertyType}
    </span>

    <h3>{property.title}</h3>

    <p>
      📍 {property.location}, {property.city}
    </p>

    <h4>
      ₹{Number(property.price).toLocaleString("en-IN")}
    </h4>

    <div className="property-basic-details">

      <span>
        🛏️ {property.bedrooms} Bedrooms
      </span>

      <span>
        🛁 {property.bathrooms} Bathrooms
      </span>

      <span>
        📐 {property.area} Sq.ft
      </span>

      <span>
        🛋️ {property.furnishing}
      </span>

    </div>

    <span className="listing-type">
      {property.listingType}
    </span>

  </div>

</div>

                );
              }
            )}

          </div>

        )}

      </section>


      {/* =====================================================
          RECENT VISITORS
          ALL REGISTERED USERS
      ===================================================== */}

      {/* <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <span className="section-small-label">
              REGISTERED USERS
            </span>

            <h2>
              Recent Visitors
            </h2>

          </div>

          <Link
            to="/owner-dashboard"
            className="dashboard-refresh"
            onClick={(e) => {
              e.preventDefault();
              fetchDashboard();
            }}
          >
            ↻ Refresh
          </Link>

        </div>


        {recentVisitors.length === 0 ? (

          <div className="dashboard-empty small">

            <div className="empty-icon">
              👥
            </div>

            <h3>
              No registered users yet
            </h3>

            <p>
              Registered users will
              appear here.
            </p>

          </div>

        ) : (

          <div className="activity-table-wrapper">

            <table className="activity-table">

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Registered
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentVisitors.map(
                  (user) => (

                    <tr
                      key={user._id}
                    >

                      <td>

                        <div className="visitor-info">

                          <div className="visitor-avatar">

                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}

                          </div>

                          <strong>
                            {
                              user.name
                            }
                          </strong>

                        </div>

                      </td>


                      <td>
                        {user.email}
                      </td>


                      <td>

                        <span
                          className={
                            user.role ===
                            "owner"
                              ? "user-role-owner"
                              : "user-role-user"
                          }
                        >
                          {user.role ===
                          "owner"
                            ? "Property Owner"
                            : "Registered User"}
                        </span>

                      </td>


                      <td>

                        {new Date(
                          user.createdAt
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section> */}

      
<section className="dashboard-section">
  <div className="dashboard-section-header">
    <div>
      <span className="section-small-label">
        REGISTERED USERS
      </span>

      <h2>
        Recent Visitors
      </h2>
    </div>

    <Link
      to="/owner-dashboard"
      className="dashboard-refresh"
      onClick={(e) => {
        e.preventDefault();
        fetchDashboard();
      }}
    >
      ↻ Refresh
    </Link>
  </div>

  {recentVisitors.filter((user) => user.role !== "owner").length === 0 ? (
    <div className="dashboard-empty small">
      <div className="empty-icon">
        👥
      </div>

      <h3>
        No registered users yet
      </h3>

      <p>
        Registered users will appear here.
      </p>
    </div>
  ) : (
    <div className="activity-table-wrapper">
      <table className="activity-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Registered</th>
          </tr>
        </thead>

        <tbody>
          {recentVisitors
            .filter((user) => user.role !== "owner")
            .map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="visitor-info">
                    <div className="visitor-avatar">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <strong>
                      {user.name}
                    </strong>
                  </div>
                </td>

                <td>
                  {user.email}
                </td>

                <td>
                  <span className="user-role-user">
                    Registered User
                  </span>
                </td>

                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString("en-IN")
                    : "N/A"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )}
</section>


      {/* =====================================================
          RECENT CUSTOMERS
          WHATSAPP ENQUIRIES
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <span className="section-small-label">
              WHATSAPP LEADS
            </span>

            <h2>
              Recent Customers
            </h2>

          </div>

        </div>


        {recentCustomers.length ===
        0 ? (

          <div className="dashboard-empty small">

            <div className="empty-icon">
              💬
            </div>

            <h3>
              No WhatsApp enquiries yet
            </h3>

            <p>
              Customers who contact
              you through WhatsApp
              will appear here.
            </p>

          </div>

        ) : (

          <div className="customer-grid">

            {recentCustomers.map(
              (customer) => (

                <div
                  className="customer-card"
                  key={customer._id}
                >

                  <div className="customer-header">

                    <div className="customer-avatar">

                      {customer.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "C"}

                    </div>

                    <div>

                      <h3>
                        {
                          customer.name
                        }
                      </h3>

                      <span>
                        WhatsApp Customer
                      </span>

                    </div>

                  </div>


                  <div className="customer-details">

                    <p>
                      📧{" "}
                      {customer.email ||
                        "Not provided"}
                    </p>

                    <p>
                      📞{" "}
                      {customer.phone ||
                        "Not provided"}
                    </p>

                    <p>
                      🏠{" "}
                      {
                        customer
                          .property
                          ?.title ||
                        "Property"
                      }
                    </p>

                    {customer
                      .property
                      ?.city && (

                      <p>
                        📍{" "}
                        {
                          customer
                            .property
                            .city
                        }
                      </p>

                    )}

                    {customer.message && (

                      <p className="customer-message">

                        💬{" "}

                        {
                          customer.message
                        }

                      </p>

                    )}

                  </div>


                  <div className="customer-footer">

                    <span>

                      {new Date(
                        customer.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}

                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default OwnerDashboard;