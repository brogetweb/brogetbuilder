import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";

function NewProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  // Authenticated user loaded from the backend
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Get the current user from MongoDB through /auth/me
  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCurrentUser(null);
      setAuthChecked(true);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const authenticatedUser = response.data.user || null;

      setCurrentUser(authenticatedUser);

      if (authenticatedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify(authenticatedUser)
        );
      }
    } catch (error) {
      console.error(
        "Failed to verify current user:",
        error.response?.data || error.message
      );

      setCurrentUser(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  // Check authentication when the page loads and after login/logout
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

  // Only approved owners may see the posting button
  const isApprovedOwner =
    currentUser?.role === "owner" &&
    currentUser?.approvalStatus === "approved";

  // Fetch projects from the backend
  const fetchProjects = async (
    searchValue = search,
    statusValue = status,
    sortValue = sort
  ) => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/projects`, {
        params: {
          search: searchValue,
          status: statusValue,
          sort: sortValue,
        },
      });

      setProjects(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh projects when status or sorting changes
  useEffect(() => {
    fetchProjects(search, status, sort);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sort]);

  // Search projects
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects(search, status, sort);
  };

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setSort("");
    fetchProjects("", "", "");
  };

  // Format price using Indian number formatting
  const formatPrice = (price) => {
    const amount = Number(price);

    return Number.isFinite(amount)
      ? amount.toLocaleString("en-IN")
      : "Price unavailable";
  };

  return (
    <div className="new-projects-page">

      {/* HERO */}
      <section className="projects-hero">
        <div className="projects-hero-content">

          <span>🏗️ NEW PROJECTS</span>

          <h1>Discover New Projects</h1>

          <p>
            Explore newly launched and upcoming residential projects.
          </p>

          {/* SEARCH BAR + APPROVED OWNER BUTTON */}
          <div className="project-search-actions">

            <form
              className="project-search"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search project, builder or location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button type="submit">
                🔍 Search
              </button>
            </form>

            {authChecked && isApprovedOwner && (
              <Link
                to="/post-new-project"
                className="post-new-project-btn"
              >
                ＋ Post New Project
              </Link>
            )}

          </div>
        </div>
      </section>

      {/* STATUS FILTER */}
      <section className="project-filters">

        <button
          type="button"
          className={status === "" ? "active" : ""}
          onClick={() => setStatus("")}
        >
          All Projects
        </button>

        <button
          type="button"
          className={status === "New Launch" ? "active" : ""}
          onClick={() => setStatus("New Launch")}
        >
          New Launch
        </button>

        <button
          type="button"
          className={
            status === "Under Construction" ? "active" : ""
          }
          onClick={() => setStatus("Under Construction")}
        >
          Under Construction
        </button>

        <button
          type="button"
          className={status === "Ready to Move" ? "active" : ""}
          onClick={() => setStatus("Ready to Move")}
        >
          Ready to Move
        </button>

      </section>

      {/* PROJECT LIST */}
      <section className="projects-container">

        <div className="projects-heading">

          <div>
            <h2>New &amp; Upcoming Projects</h2>
            <p>{projects.length} projects found</p>
          </div>

          <div className="project-controls">

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort projects"
            >
              <option value="">Sort By</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>

            <button
              type="button"
              className="project-reset-btn"
              onClick={resetFilters}
            >
              Reset
            </button>

          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="loading">
            Loading projects...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && projects.length === 0 && (
          <div className="no-properties">
            <h3>No projects found</h3>

            <p>
              Try changing your search or publish a new project.
            </p>

            {isApprovedOwner && (
              <Link
                to="/post-new-project"
                className="post-new-project-btn"
              >
                ＋ Post New Project
              </Link>
            )}

            <button
              type="button"
              onClick={resetFilters}
            >
              Show All Projects
            </button>
          </div>
        )}

        {/* PROJECT CARDS */}
        <div className="property-grid">
        
                  {projects.map((project) => (
        
                    <ProjectCard
                      key={project._id}
                      project={project}
                    />
        
                  ))}
        
                </div>
      </section>

      {/* WHY PROJECTS */}
      <section className="why-projects">

        <h2>Explore New Projects</h2>

        <div className="why-project-grid">

          <div>
            <div className="why-icon">🏗️</div>
            <h3>New Construction</h3>
            <p>
              Discover newly launched residential projects.
            </p>
          </div>

          <div>
            <div className="why-icon">💰</div>
            <h3>Compare Prices</h3>
            <p>
              Compare prices and configurations.
            </p>
          </div>

          <div>
            <div className="why-icon">🏠</div>
            <h3>Modern Amenities</h3>
            <p>
              Find projects with modern lifestyle amenities.
            </p>
          </div>

          <div>
            <div className="why-icon">📍</div>
            <h3>Prime Locations</h3>
            <p>
              Explore projects in popular locations.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default NewProjects;