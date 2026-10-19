import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { API_URL } from "../config";
import "./OwnerDashboard.css";

const CHART_COLORS = [
  "#f04452",
  "#e99a64",
  "#7776d9",
  "#45b8a8",
  "#e8bd55",
  "#4c9be8",
  "#d66ba0",
];

function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertySearch, setPropertySearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to access your owner dashboard.");
        return;
      }

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
      setProjects(
        Array.isArray(data.projects) ? data.projects : []
      );
      setRecentVisitors(
        Array.isArray(data.recentVisitors)
          ? data.recentVisitors
          : []
      );
      setRecentCustomers(
        Array.isArray(data.recentCustomers)
          ? data.recentCustomers
          : []
      );
    } catch (err) {
      console.error("Error fetching owner dashboard:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const registeredUsers = useMemo(
    () =>
      recentVisitors.filter(
        (user) =>
          user.role !== "owner" &&
          user.role !== "superadmin"
      ),
    [recentVisitors]
  );

  const formatPrice = (price) => {
    if (
      price == null ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return "Price on request";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const getPropertyType = (item) =>
    item.propertyType ||
    item.type ||
    item.category ||
    "Property";

  const getArea = (item) => {
    const areaFields = [
      "areaSqFt",
      "squareFeet",
      "sqft",
      "area",
      "builtUpArea",
      "carpetArea",
      "superBuiltUpArea",
      "superBuiltUpAreaSqFt",
      "builtUpAreaSqFt",
      "carpetAreaSqFt",
    ];

    for (const field of areaFields) {
      const value = item[field];

      if (
        value != null &&
        value !== "" &&
        Number.isFinite(Number(value)) &&
        Number(value) > 0
      ) {
        return Number(value);
      }
    }

    return null;
  };

  const formatArea = (item) => {
    const area = getArea(item);

    return area != null
      ? `${area.toLocaleString("en-IN")} sq.ft`
      : "—";
  };

  const getImage = (item, fallbackText = "Property") => {
    if (Array.isArray(item.images) && item.images.length) {
      return item.images[0];
    }

    if (typeof item.image === "string" && item.image) {
      return item.image;
    }

    return `https://placehold.co/100x75?text=${fallbackText}`;
  };

  // PROPERTY LISTING DISTRIBUTION
  const listingDistribution = useMemo(() => {
    const counts = properties.reduce((result, property) => {
      const type = property.listingType || "Other";
      result[type] = (result[type] || 0) + 1;
      return result;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [properties]);

  // PROJECT STATUS DISTRIBUTION
  const projectStatusDistribution = useMemo(() => {
    const counts = projects.reduce((result, project) => {
      const status = project.status || "Unspecified";
      result[status] = (result[status] || 0) + 1;
      return result;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [projects]);

  // PORTFOLIO OVERVIEW
  const overviewData = useMemo(
    () => [
      {
        name: "Properties",
        total: Number(
          statistics.totalProperties ?? properties.length
        ),
      },
      {
        name: "Projects",
        total: Number(
          statistics.totalProjects ?? projects.length
        ),
      },
      {
        name: "Users",
        total: Number(
          statistics.registeredUsers ?? registeredUsers.length
        ),
      },
      {
        name: "Enquiries",
        total: Number(
          statistics.totalCustomers ?? recentCustomers.length
        ),
      },
      {
        name: "Favourites",
        total: Number(statistics.totalFavourites ?? 0),
      },
    ],
    [
      statistics,
      properties.length,
      projects.length,
      registeredUsers.length,
      recentCustomers.length,
    ]
  );

  // SEARCH PROPERTIES
  const filteredProperties = useMemo(() => {
    const query = propertySearch.trim().toLowerCase();

    if (!query) return properties;

    return properties.filter((property) =>
      [
        property.title,
        property.city,
        property.location,
        property.listingType,
        property.propertyType,
        property.type,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [properties, propertySearch]);

  // SEARCH PROJECTS
  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();

    if (!query) return projects;

    return projects.filter((project) =>
      [
        project.name,
        project.title,
        project.city,
        project.location,
        project.status,
        project.propertyType,
        project.type,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [projects, projectSearch]);

  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { href: "#overview", icon: "▦", label: "Overview" },
    { href: "#analytics", icon: "◔", label: "Analytics" },
    { href: "#properties", icon: "⌂", label: "My Properties" },
    { href: "#projects", icon: "▤", label: "My Projects" },
    { href: "#users", icon: "♙", label: "Registered Users" },
    { href: "#enquiries", icon: "✉", label: "Customer Enquiries" },
  ];

  const stats = [
    {
      label: "Total Properties",
      value: statistics.totalProperties ?? properties.length,
      icon: "🏠",
      color: "red",
    },
    {
      label: "Total Projects",
      value: statistics.totalProjects ?? projects.length,
      icon: "🏗️",
      color: "orange",
    },
    {
      label: "Registered Users",
      value: statistics.registeredUsers ?? registeredUsers.length,
      icon: "👥",
      color: "purple",
    },
    {
      label: "Customer Enquiries",
      value: statistics.totalCustomers ?? recentCustomers.length,
      icon: "📲",
      color: "teal",
    },
    {
      label: "Total Favourites",
      value: statistics.totalFavourites ?? 0,
      icon: "❤️",
      color: "pink",
    },
  ];

  if (loading) {
    return (
      <div className="owner-dashboard-state">
        <div className="dashboard-loading">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-dashboard-state">
        <div className="dashboard-error">
          <h2>Dashboard unavailable</h2>
          <p>{error}</p>

          <button type="button" onClick={fetchDashboard}>
            Try Again
          </button>

          {!localStorage.getItem("token") && (
            <Link to="/login" className="dashboard-add-btn">
              Log In
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard-layout">
      {sidebarOpen && (
        <button
          type="button"
          className="owner-sidebar-overlay"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`owner-sidebar ${
          sidebarOpen ? "is-open" : ""
        }`}
      >
        <div className="owner-sidebar-brand">
          <div className="owner-brand-icon">B</div>

          <div>
            <strong>BuilderBroget</strong>
            <span>OWNER STUDIO</span>
          </div>

          <button
            type="button"
            className="owner-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <p className="owner-nav-caption">WORKSPACE</p>

        <nav className="owner-sidebar-nav">
          {navItems.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={closeSidebar}
              className={
                item.href === "#overview" ? "active" : ""
              }
            >
              <span className="owner-nav-icon">
                {item.icon}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <p className="owner-nav-caption">QUICK ACTIONS</p>

        <div className="owner-sidebar-actions">
          <Link to="/post-property" onClick={closeSidebar}>
            <span>＋</span>
            Post Property
          </Link>

          <Link to="/post-new-project" onClick={closeSidebar}>
            <span>＋</span>
            Post New Project
          </Link>
        </div>

        <div className="owner-sidebar-bottom">
          <div className="owner-sidebar-avatar">
            {(owner?.name || "O").charAt(0).toUpperCase()}
          </div>

          <div className="owner-sidebar-user">
            <strong>{owner?.name || "Property Owner"}</strong>
            <span>Owner account</span>
          </div>

          <Link
            to="/"
            className="owner-home-link"
            title="Visit website"
          >
            ↗
          </Link>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="owner-dashboard-main">
        <header className="owner-topbar">
          <button
            type="button"
            className="owner-menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>

          <div className="owner-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Dashboard</strong>
          </div>

          <div className="owner-topbar-right">
            <span className="owner-live-dot" />
            <span>Owner portal</span>

            <div className="owner-topbar-avatar">
              {(owner?.name || "O").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="owner-dashboard-content">
          {/* WELCOME */}
          <section
            className="owner-welcome-banner"
            id="overview"
          >
            <div>
              <p className="dashboard-eyebrow">
                OWNER CONTROL CENTER
              </p>

              <h1>
                Welcome back, {owner?.name || "Property Owner"}!
              </h1>

              <p>
                Here's an overview of your listings and customer
                activity.
              </p>

              <div className="owner-welcome-actions">
                <Link
                  to="/post-property"
                  className="dashboard-add-btn"
                >
                  ＋ Add Property
                </Link>

                <Link
                  to="/post-new-project"
                  className="dashboard-outline-btn"
                >
                  ＋ Add Project
                </Link>
              </div>
            </div>

            <div className="owner-banner-art" aria-hidden="true">
              <span>⌂</span>
              <div className="owner-banner-building building-one" />
              <div className="owner-banner-building building-two" />
              <div className="owner-banner-building building-three" />
            </div>
          </section>

          {/* STATISTICS */}
          <section className="dashboard-stats owner-dashboard-stats">
            {stats.map((stat) => (
              <article
                className={`stat-card stat-${stat.color}`}
                key={stat.label}
              >
                <div className="owner-stat-top">
                  <span className="stat-icon">{stat.icon}</span>
                  <span className="owner-stat-indicator">LIVE</span>
                </div>

                <div>
                  <h3>{stat.label}</h3>
                  <p>{stat.value}</p>
                </div>
              </article>
            ))}
          </section>

          {/* ANALYTICS */}
          <section
            className="owner-analytics-section"
            id="analytics"
          >
            <div className="section-heading owner-heading">
              <div>
                <p className="section-label">
                  PERFORMANCE OVERVIEW
                </p>
                <h2>Analytics & Statistics</h2>
                <p>
                  Understand your current listings and activity
                  at a glance.
                </p>
              </div>

              <button
                type="button"
                className="owner-refresh-btn"
                onClick={fetchDashboard}
              >
                ↻ Refresh data
              </button>
            </div>

            <div className="owner-charts-grid">
              {/* LISTING DISTRIBUTION */}
              <article className="owner-chart-card">
                <div className="owner-chart-heading">
                  <div>
                    <h3>Listing Distribution</h3>
                    <p>Properties grouped by listing type</p>
                  </div>
                  <span className="owner-chart-icon">◔</span>
                </div>

                {listingDistribution.length === 0 ? (
                  <div className="owner-chart-empty">
                    <span>◔</span>
                    <p>No property listing data yet.</p>
                    <Link to="/post-property">
                      Add your first property
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="owner-pie-wrap">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={listingDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                          >
                            {listingDistribution.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={
                                  CHART_COLORS[
                                    index % CHART_COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>

                          <Tooltip
                            contentStyle={{
                              background: "#211d20",
                              border: "1px solid #49353a",
                              borderRadius: 10,
                              color: "#fff",
                            }}
                          />

                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <p className="owner-chart-footnote">
                      Based on {properties.length} properties
                      returned by your dashboard.
                    </p>
                  </>
                )}
              </article>

              {/* PROJECT STATUS */}
              <article className="owner-chart-card">
                <div className="owner-chart-heading">
                  <div>
                    <h3>Project Status</h3>
                    <p>Projects grouped by current status</p>
                  </div>
                  <span className="owner-chart-icon">◉</span>
                </div>

                {projectStatusDistribution.length === 0 ? (
                  <div className="owner-chart-empty">
                    <span>🏗️</span>
                    <p>No project status data yet.</p>
                    <Link to="/post-new-project">
                      Add your first project
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="owner-pie-wrap">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={projectStatusDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                          >
                            {projectStatusDistribution.map(
                              (entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={
                                    CHART_COLORS[
                                      index % CHART_COLORS.length
                                    ]
                                  }
                                />
                              )
                            )}
                          </Pie>

                          <Tooltip
                            contentStyle={{
                              background: "#211d20",
                              border: "1px solid #49353a",
                              borderRadius: 10,
                              color: "#fff",
                            }}
                          />

                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <p className="owner-chart-footnote">
                      Based on {projects.length} projects
                      returned by your dashboard.
                    </p>
                  </>
                )}
              </article>

              {/* PORTFOLIO OVERVIEW */}
              <article className="owner-chart-card">
                <div className="owner-chart-heading">
                  <div>
                    <h3>Portfolio Overview</h3>
                    <p>Compare your current totals</p>
                  </div>
                  <span className="owner-chart-icon">▥</span>
                </div>

                <div className="owner-bar-wrap">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={overviewData}
                      margin={{
                        top: 12,
                        right: 8,
                        left: -18,
                        bottom: 8,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#393236"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#aaa0a5", fontSize: 10 }}
                        axisLine={{ stroke: "#493e43" }}
                        tickLine={false}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={55}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#aaa0a5", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#211d20",
                          border: "1px solid #49353a",
                          borderRadius: 10,
                          color: "#fff",
                        }}
                        cursor={{
                          fill: "rgba(240,68,82,0.08)",
                        }}
                      />

                      <Bar
                        dataKey="total"
                        name="Total"
                        fill="#f04452"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={35}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <p className="owner-chart-footnote">
                  Counts reflect the data currently supplied by
                  the backend.
                </p>
              </article>
            </div>
          </section>

          {/* MY PROPERTIES - TABLE */}
          <section className="dashboard-section" id="properties">
            <div className="section-heading owner-heading">
              <div>
                <p className="section-label">YOUR LISTINGS</p>
                <h2>My Properties</h2>
                <p>Review and manage your listed properties.</p>
              </div>

              <Link to="/post-property" className="section-link">
                ＋ Add New Property
              </Link>
            </div>

            <div className="owner-listing-toolbar">
              <span>
                {filteredProperties.length} of {properties.length} properties
              </span>

              <input
                type="search"
                value={propertySearch}
                onChange={(event) =>
                  setPropertySearch(event.target.value)
                }
                placeholder="Search by title, city or type..."
                aria-label="Search properties"
              />
            </div>

            {filteredProperties.length === 0 ? (
              <div className="dashboard-empty">
                <span>🏡</span>
                <h3>
                  {properties.length === 0
                    ? "No properties listed yet"
                    : "No matching properties"}
                </h3>
                <p>
                  {properties.length === 0
                    ? "Your next great listing could start right here."
                    : "Try another search term."}
                </p>

                {properties.length === 0 && (
                  <Link
                    to="/post-property"
                    className="dashboard-add-btn"
                  >
                    Post Your First Property
                  </Link>
                )}
              </div>
            ) : (
              <div className="dashboard-table-wrapper owner-listing-table-wrapper">
                <table className="dashboard-table owner-listing-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Location</th>
                      <th>Listing Type</th>
                      <th>Property Type</th>
                      <th>Price</th>
                      <th>Area</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProperties.map((property) => (
                      <tr key={property._id}>
                        <td>
                          <div className="owner-listing-item">
                            <img
                              src={getImage(property, "Property")}
                              alt={property.title || "Property"}
                              loading="lazy"
                            />
                            <div className="owner-listing-item-info">
                              <strong>
                                {property.title || "Untitled Property"}
                              </strong>
                            </div>
                          </div>
                        </td>

                        <td>
                          {[
                            property.location,
                            property.city,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Not specified"}
                        </td>

                        <td>
                          <span className="owner-table-badge">
                            {property.listingType || "Property"}
                          </span>
                        </td>

                        <td>{getPropertyType(property)}</td>

                        <td className="owner-table-price">
                          {formatPrice(property.price)}
                        </td>

                        <td>{formatArea(property)}</td>

                        <td>
                          <Link
                            to={`/property/${property._id}`}
                            className="owner-table-action"
                          >
                            View Property ↗
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* MY PROJECTS - TABLE */}
          <section className="dashboard-section" id="projects">
            <div className="section-heading owner-heading">
              <div>
                <p className="section-label">YOUR DEVELOPMENTS</p>
                <h2>My Projects</h2>
                <p>Review and manage projects published by your account.</p>
              </div>

              <Link
                to="/post-new-project"
                className="section-link"
              >
                ＋ Add New Project
              </Link>
            </div>

            <div className="owner-listing-toolbar">
              <span>
                {filteredProjects.length} of {projects.length} projects
              </span>

              <input
                type="search"
                value={projectSearch}
                onChange={(event) =>
                  setProjectSearch(event.target.value)
                }
                placeholder="Search by name, city or status..."
                aria-label="Search projects"
              />
            </div>

            {filteredProjects.length === 0 ? (
              <div className="dashboard-empty">
                <span>🏗️</span>
                <h3>
                  {projects.length === 0
                    ? "No projects listed yet"
                    : "No matching projects"}
                </h3>
                <p>
                  {projects.length === 0
                    ? "Your published real estate projects will appear here."
                    : "Try another search term."}
                </p>

                {projects.length === 0 && (
                  <Link
                    to="/post-new-project"
                    className="dashboard-add-btn"
                  >
                    Post Your First Project
                  </Link>
                )}
              </div>
            ) : (
              <div className="dashboard-table-wrapper owner-listing-table-wrapper">
                <table className="dashboard-table owner-listing-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Property Type</th>
                      <th>Price Range</th>
                      <th>Area</th>
                      <th>Possession</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project._id}>
                        <td>
                          <div className="owner-listing-item">
                            <img
                              src={getImage(project, "Project")}
                              alt={
                                project.name ||
                                project.title ||
                                "Project"
                              }
                              loading="lazy"
                            />
                            <div className="owner-listing-item-info">
                              <strong>
                                {project.name ||
                                  project.title ||
                                  "Untitled Project"}
                              </strong>
                              <span>
                                ID: {project._id || "—"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {[
                            project.location,
                            project.city,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Not specified"}
                        </td>

                        <td>
                          <span className="owner-table-badge">
                            {project.status || "Unspecified"}
                          </span>
                        </td>

                        <td>{getPropertyType(project)}</td>

                        <td className="owner-table-price">
                          {project.minPrice == null &&
                          project.maxPrice == null
                            ? "Price on request"
                            : project.minPrice != null &&
                                project.maxPrice != null &&
                                Number(project.minPrice) !==
                                  Number(project.maxPrice)
                              ? `${formatPrice(project.minPrice)} - ${formatPrice(project.maxPrice)}`
                              : formatPrice(
                                  project.minPrice ?? project.maxPrice
                                )}
                        </td>

                        <td>{formatArea(project)}</td>

                        <td>{project.possession || "—"}</td>

                        <td>
                          <Link
                            to={`/project/${project._id}`}
                            className="owner-table-action"
                          >
                            View Project ↗
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* REGISTERED USERS */}
          <section className="dashboard-section" id="users">
            <div className="section-heading owner-heading">
              <div>
                <p className="section-label">WEBSITE ACTIVITY</p>
                <h2>Registered Users</h2>
                <p>
                  Customer accounts returned by your dashboard API.
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
                  Registered customer activity will appear here
                  when available.
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
                      <th>Registration / Activity Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {registeredUsers.map((user, index) => (
                      <tr key={user._id || index}>
                        <td>
                          <div className="dashboard-user">
                            <div className="user-avatar">
                              {(user.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <span>
                              {user.name || "Unknown User"}
                            </span>
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
                            ? new Date(user.createdAt).toLocaleDateString("en-IN")
                            : user.lastVisited
                              ? new Date(user.lastVisited).toLocaleDateString("en-IN")
                              : "Not available"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* CUSTOMER ENQUIRIES */}
          <section className="dashboard-section" id="enquiries">
            <div className="section-heading owner-heading">
              <div>
                <p className="section-label">CUSTOMER ENQUIRIES</p>
                <h2>Recent Customers / WhatsApp Leads</h2>
                <p>
                  People who have contacted you about your listings.
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
                      <th>Contact</th>
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
                            ? new Date(customer.createdAt).toLocaleDateString("en-IN")
                            : "Not available"}
                        </td>

                        <td>
                          {customer.phone ? (
                            <a
                              className="owner-contact-link"
                              href={`https://wa.me/${String(
                                customer.phone
                              ).replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              WhatsApp ↗
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* FOOTER */}
          <footer className="owner-dashboard-footer">
            <span>
              © {new Date().getFullYear()} BuilderBroget Owner Studio
            </span>
            <Link to="/">Back to website ↗</Link>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default OwnerDashboard;