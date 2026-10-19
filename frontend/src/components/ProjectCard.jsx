import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function ProjectCard({ project }) {

  const navigate = useNavigate();

  const [favorite, setFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] =
    useState(false);

  const image =
    project.images &&
    project.images.length > 0
      ? project.images[0]
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";


  // =====================================
  // CHECK LOGIN + FAVOURITE
  // =====================================

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const checkFavourite = async () => {

      try {

        const response = await axios.get(
          `${API_URL}/favourites/check/${project._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFavorite(response.data.favourite);

      } catch (error) {

        console.log(error);

      }

    };

    checkFavourite();

  }, [project._id]);


  // =====================================
  // HANDLE FAVOURITE
  // =====================================

  const handleFavourite = async () => {

    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {

      alert(
        "Please login or register to add projects to favourites."
      );

      navigate("/login");

      return;
    }

    try {

      setLoadingFavorite(true);

      if (favorite) {

        // REMOVE FAVOURITE

        await axios.delete(
          `${API_URL}/favourites/${project._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFavorite(false);

      } else {

        // ADD FAVOURITE

        await axios.post(
          `${API_URL}/favourites/${project._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFavorite(true);
      }

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoadingFavorite(false);

    }
  };


  return (
    <div className="project-card">

      {/* IMAGE */}

      <div className="project-image">

        <img
          src={image}
          alt={project.title}
        />


        {/* FAVORITE */}

        <button
          className="favorite-btn"
          onClick={handleFavourite}
          disabled={loadingFavorite}
        >
          {favorite ? "❤️" : "🤍"}
        </button>


        {/* FEATURED */}

        {project.featured && (
          <span className="featured-badge">
            Featured
          </span>
        )}

        <span className="project-status">
                    {project.status}
                  </span>


        {/* VERIFIED */}

        {project.verified && (
          <span className="verified-badge">
            ✓ Verified
          </span>
        )}

      </div>


      {/* INFORMATION */}

      <div className="project-info">

        <div className="project-top">

          <span className="project-type">
            {project.projectType}
          </span>

          <span className="listing-type">
            {project.listingType}
          </span>

        </div>


        <h3>
          {project.title}
        </h3>


        <p className="location">
          📍 {project.location},{" "}
          {project.city}
        </p>


        <h2>
          ₹{project.price}
        </h2>


        <div className="property-features">

          <span>
            🛏️ {project.bedrooms} BHK
          </span>

          <span>
            🛁 {project.bathrooms} Bath
          </span>

          <span>
            📐 {project.area} Sq.ft
          </span>

        </div>


        {/* AMENITIES */}

        <div className="card-amenities">

          {project.amenities &&
          project.amenities.length > 0 ? (

            project.amenities
              .slice(0, 3)
              .map((amenity, index) => (
                <span key={index}>
                  {amenity}
                </span>
              ))

          ) : (

            <span>
              No amenities added
            </span>

          )}

        </div>


        <Link
          to={`/property/${project._id}`}
          className="view-btn"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}

export default ProjectCard;