import { useEffect, useState } from "react";
import {
  Link,
  useParams
} from "react-router-dom";
import axios from "axios";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchProject = async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(
            `http://localhost:5000/api/projects/${id}`
          );

        const projectData =
          response.data;

        setProject(projectData);

        if (
          projectData.images &&
          projectData.images.length > 0
        ) {

          setSelectedImage(
            projectData.images[0]
          );

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchProject();

  }, [id]);


  if (loading) {

    return (
      <div className="details-loading">
        Loading project...
      </div>
    );

  }


  if (!project) {

    return (
      <div className="details-error">

        <h2>
          Project not found
        </h2>

        <Link to="/new-projects">
          Go Back to Projects
        </Link>

      </div>
    );

  }


  const images =
    project.images &&
    project.images.length > 0
      ? project.images
      : [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000"
        ];


  return (
    <div className="project-details-page">

      {/* BREADCRUMB */}

      <div className="breadcrumb">

        <Link to="/">
          Home
        </Link>

        <span>/</span>

        <Link to="/new-projects">
          New Projects
        </Link>

        <span>/</span>

        <span>
          {project.name}
        </span>

      </div>


      {/* GALLERY */}

      <section className="project-details-gallery">

        <div className="project-main-image">

          <img
            src={selectedImage}
            alt={project.name}
          />


          <span className="project-detail-status">
            {project.status}
          </span>


          {project.verified && (
            <span className="project-detail-verified">
              ✓ Verified
            </span>
          )}

        </div>


        <div className="project-thumbnails">

          {images.map(
            (image, index) => (

              <button
                key={index}
                className={
                  selectedImage === image
                    ? "project-thumbnail active"
                    : "project-thumbnail"
                }
                onClick={() =>
                  setSelectedImage(
                    image
                  )
                }
              >

                <img
                  src={image}
                  alt={
                    `Project ${index + 1}`
                  }
                />

              </button>

            )
          )}

        </div>

      </section>


      {/* PROJECT CONTENT */}

      <section className="project-details-main">

        <div className="project-details-left">

          <p className="project-builder">
            {project.builder}
          </p>


          <h1>
            {project.name}
          </h1>


          <p className="project-location">
            📍 {project.location},{" "}
            {project.city}
          </p>


          {/* PRICE */}

          <div className="project-detail-price">

            <h2>

              ₹
              {project.minPrice.toLocaleString(
                "en-IN"
              )}

              {" - "}

              ₹
              {project.maxPrice.toLocaleString(
                "en-IN"
              )}

            </h2>

            <span>
              Price Range
            </span>

          </div>


          {/* CONFIGURATIONS */}

          <div className="project-detail-box">

            <h2>
              Configurations
            </h2>


            <div className="configuration-list">

              {project.configurations.map(
                (configuration) => (

                  <div
                    key={configuration}
                  >
                    🏠 {configuration}
                  </div>

                )
              )}

            </div>

          </div>


          {/* PROJECT INFORMATION */}

          <div className="project-detail-box">

            <h2>
              Project Information
            </h2>


            <div className="project-information-grid">

              <div>

                <span>
                  Property Type
                </span>

                <strong>
                  {project.propertyType}
                </strong>

              </div>


              <div>

                <span>
                  Area
                </span>

                <strong>
                  {project.area}
                </strong>

              </div>


              <div>

                <span>
                  Status
                </span>

                <strong>
                  {project.status}
                </strong>

              </div>


              <div>

                <span>
                  Possession
                </span>

                <strong>
                  {project.possession}
                </strong>

              </div>

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="project-detail-box">

            <h2>
              About this Project
            </h2>

            <p className="project-description">
              {project.description}
            </p>

          </div>


          {/* AMENITIES */}

          <div className="project-detail-box">

            <h2>
              Amenities
            </h2>


            <div className="project-detail-amenities">

              {project.amenities.map(
                (amenity) => (

                  <div
                    key={amenity}
                  >
                    ✓ {amenity}
                  </div>

                )
              )}

            </div>

          </div>

        </div>


        {/* BUILDER CARD */}

        <aside className="project-builder-card">

          <h2>
            Interested in this Project?
          </h2>


          <div className="builder-profile">

            <div className="builder-avatar">
              🏢
            </div>


            <div>

              <h3>
                {project.contactName}
              </h3>

              <p>
                Project Developer
              </p>

            </div>

          </div>


          <a
            href={`tel:${project.contactNumber}`}
            className="project-contact-btn"
          >
            📞 Contact Builder
          </a>


          <a
            href={`tel:${project.contactNumber}`}
            className="project-enquiry-btn"
          >
            💬 Send Enquiry
          </a>

        </aside>

      </section>

    </div>
  );
}

export default ProjectDetails;