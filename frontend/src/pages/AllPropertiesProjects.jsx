
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../config";
import PropertyCard from "../components/PropertyCard";
import ProjectCard from "../components/ProjectCard";

import "./PopularLocalities.css";

function AllPropertiesProjects() {
  const [searchParams] = useSearchParams();

  const selectedLocation = searchParams.get("location") || "";

  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPropertiesAndProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};

        if (selectedLocation) {
          params.location = selectedLocation;
        }

        // Keep the existing property logic.
        // Do not send listingType, so Buy, Rent and PG are included.
        const [propertiesResult, projectsResult] =
          await Promise.allSettled([
            axios.get(`${API_URL}/properties`, { params }),
            axios.get(`${API_URL}/projects`),
          ]);

        // -------------------------------
        // PROPERTIES
        // -------------------------------
        if (propertiesResult.status === "fulfilled") {
          const responseData = propertiesResult.value.data;

          const propertiesData = Array.isArray(responseData)
            ? responseData
            : responseData?.properties || [];

          setProperties(propertiesData);
        } else {
          console.error(
            "Error fetching properties:",
            propertiesResult.reason
          );

          setProperties([]);
        }

        // -------------------------------
        // PROJECTS
        // -------------------------------
        if (projectsResult.status === "fulfilled") {
          const responseData = projectsResult.value.data;

          const projectsData = Array.isArray(responseData)
            ? responseData
            : responseData?.projects || [];

          const normalize = (value) =>
            String(value || "")
              .trim()
              .toLowerCase()
              .replace(/\s+/g, " ");

          const selected = normalize(selectedLocation);

          // Show projects belonging to the selected locality.
          // If no locality is selected, show all projects.
          const filteredProjects = selected
            ? projectsData.filter((project) => {
                const location = normalize(project.location);
                const city = normalize(project.city);

                return (
                  location === selected ||
                  location.includes(selected) ||
                  selected.includes(location) ||
                  city === selected ||
                  (location && city
                    ? normalize(`${location}, ${city}`).includes(selected)
                    : false)
                );
              })
            : projectsData;

          console.log("Selected locality:", selectedLocation);

          console.log(
            "Projects returned by API:",
            projectsData.map((project) => ({
              id: project._id,
              name: project.name,
              location: project.location,
              city: project.city,
            }))
          );

          console.log("Filtered projects:", filteredProjects);

          setProjects(filteredProjects);
        } else {
          console.error(
            "Error fetching projects:",
            projectsResult.reason
          );

          setProjects([]);
        }

        // Display an error only if both requests failed.
        if (
          propertiesResult.status === "rejected" &&
          projectsResult.status === "rejected"
        ) {
          setError(
            "Unable to load properties and projects. Please try again."
          );
        }
      } catch (err) {
        console.error(
          "Error fetching properties and projects:",
          err
        );

        setError(
          "Unable to load properties and projects. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesAndProjects();
  }, [selectedLocation]);

  const totalResults = properties.length + projects.length;

  return (
    <section className="all-properties-page">
      <div className="all-properties-header">
        <span>BUILDERBROGET PROPERTY DISCOVERY</span>

        <h1>
          Properties &amp; Projects in{" "}
          {selectedLocation || "All Localities"}
        </h1>

        <p>
          Explore properties available for buying, renting and PG
          stays, along with residential projects in your preferred area.
        </p>
      </div>

      {loading && (
        <p>Loading properties and projects...</p>
      )}

      {!loading && error && (
        <p>{error}</p>
      )}

      {!loading && !error && totalResults === 0 && (
        <p>
          No properties or projects found in{" "}
          {selectedLocation || "this area"}.
        </p>
      )}

      {!loading && !error && totalResults > 0 && (
        <>
          <p className="all-properties-count">
            {properties.length} properties and {projects.length} projects
            found
          </p>

          {/* EXISTING PROPERTY CARDS */}
          {properties.length > 0 && (
            <div className="all-properties-section">
              <div className="all-properties-section-heading">
                <div>
                  <h2>Properties</h2>
                  <p>
                    Explore properties for buying, renting and PG stays.
                  </p>
                </div>

                <span>{properties.length} properties</span>
              </div>

              <div className="all-properties-grid">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    listingType={property.listingType || "Buy"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS USING THE EXISTING PROJECT CARD */}
          {projects.length > 0 && (
            <div className="all-properties-section">
              <div className="all-properties-section-heading">
                <div>
                  <h2>New Projects</h2>
                  <p>
                    Residential projects available in this locality.
                  </p>
                </div>

                <span>{projects.length} projects</span>
              </div>

              <div className="all-properties-grid">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AllPropertiesProjects;
