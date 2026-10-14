import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function NewProjects() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [sort, setSort] =
    useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response =
        await axios.get(
          "http://localhost:5000/api/projects",
          {
            params: {
              search,
              status,
              sort
            }
          }
        );

      setProjects(
        response.data
      );

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProjects();
  }, [status, sort]);


  const handleSearch = (e) => {
    e.preventDefault();

    fetchProjects();
  };


  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setSort("");
  };


  return (
    <div className="new-projects-page">

      {/* HERO */}

      <section className="projects-hero">

        <div className="projects-hero-content">

          <span>
            🏗️ NEW PROJECTS
          </span>

          <h1>
            Discover New Projects
          </h1>

          <p>
            Explore newly launched and
            upcoming residential projects.
          </p>


          <form
            className="project-search"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              placeholder="Search project, builder or location"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <button type="submit">
              🔍 Search
            </button>

          </form>

        </div>

      </section>


      {/* STATUS FILTER */}

      <section className="project-filters">

        <button
          className={
            status === ""
              ? "active"
              : ""
          }
          onClick={() =>
            setStatus("")
          }
        >
          All Projects
        </button>


        <button
          className={
            status === "New Launch"
              ? "active"
              : ""
          }
          onClick={() =>
            setStatus(
              "New Launch"
            )
          }
        >
          New Launch
        </button>


        <button
          className={
            status ===
            "Under Construction"
              ? "active"
              : ""
          }
          onClick={() =>
            setStatus(
              "Under Construction"
            )
          }
        >
          Under Construction
        </button>


        <button
          className={
            status ===
            "Ready to Move"
              ? "active"
              : ""
          }
          onClick={() =>
            setStatus(
              "Ready to Move"
            )
          }
        >
          Ready to Move
        </button>

      </section>


      {/* PROJECT LIST */}

      <section className="projects-container">

        <div className="projects-heading">

          <div>

            <h2>
              New & Upcoming Projects
            </h2>

            <p>
              {projects.length} projects found
            </p>

          </div>


          <div className="project-controls">

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
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
              className="project-reset-btn"
              onClick={resetFilters}
            >
              Reset
            </button>

          </div>

        </div>


        {loading && (
          <div className="loading">
            Loading projects...
          </div>
        )}


        {!loading &&
          projects.length === 0 && (
            <div className="no-properties">

              <h3>
                No projects found
              </h3>

              <p>
                Try changing your search.
              </p>

              <button
                onClick={resetFilters}
              >
                Show All Projects
              </button>

            </div>
          )}


        <div className="projects-grid">

          {!loading &&
            projects.map(
              (project) => (

                <div
                  className="project-card"
                  key={project._id}
                >

                  {/* IMAGE */}

                  <div className="project-image">

                    <img
                      src={
                        project.images?.[0] ||
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000"
                      }
                      alt={project.name}
                    />


                    <span className="project-status">
                      {project.status}
                    </span>


                    {project.verified && (
                      <span className="project-verified">
                        ✓ Verified
                      </span>
                    )}

                  </div>


                  {/* INFORMATION */}

                  <div className="project-info">

                    <p className="project-builder">
                      {project.builder}
                    </p>


                    <h3>
                      {project.name}
                    </h3>


                    <p className="project-location">
                      📍 {project.location},{" "}
                      {project.city}
                    </p>


                    <div className="project-type">

                      🏠{" "}
                      {project.configurations?.join(
                        " • "
                      )}

                    </div>


                    <div className="project-price">

                      ₹
                      {project.minPrice.toLocaleString(
                        "en-IN"
                      )}

                      {" - "}

                      ₹
                      {project.maxPrice.toLocaleString(
                        "en-IN"
                      )}

                    </div>


                    <div className="project-possession">

                      <span>
                        Possession
                      </span>

                      <strong>
                        {project.possession}
                      </strong>

                    </div>


                    <div className="project-amenities">

                      {project.amenities
                        ?.slice(0, 3)
                        .map(
                          (amenity) => (

                            <span
                              key={amenity}
                            >
                              {amenity}
                            </span>

                          )
                        )}

                    </div>


                    <Link
                      to={`/project/${project._id}`}
                      className="view-project-btn"
                    >
                      View Project
                    </Link>

                  </div>

                </div>

              )
            )}

        </div>

      </section>


      {/* WHY PROJECTS */}

      <section className="why-projects">

        <h2>
          Explore New Projects
        </h2>


        <div className="why-project-grid">

          <div>

            <div className="why-icon">
              🏗️
            </div>

            <h3>
              New Construction
            </h3>

            <p>
              Discover newly launched
              residential projects.
            </p>

          </div>


          <div>

            <div className="why-icon">
              💰
            </div>

            <h3>
              Compare Prices
            </h3>

            <p>
              Compare prices and
              configurations.
            </p>

          </div>


          <div>

            <div className="why-icon">
              🏠
            </div>

            <h3>
              Modern Amenities
            </h3>

            <p>
              Find projects with modern
              lifestyle amenities.
            </p>

          </div>


          <div>

            <div className="why-icon">
              📍
            </div>

            <h3>
              Prime Locations
            </h3>

            <p>
              Explore projects in
              popular locations.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default NewProjects;