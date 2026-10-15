import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import PropertyCard from "../components/PropertyCard";

function Favourites() {

  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchFavourites = async () => {

    try {

      const token =
        localStorage.getItem("token");

      // User is not logged in
      if (!token) {

        setLoading(false);

        return;

      }


      const response = await axios.get(
        "http://localhost:5000/api/favourites",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      setProperties(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchFavourites();

  }, []);


  return (
    <div className="favourites-page">

      <section className="favourites-header">

        <span className="section-label">
          HOMEESTATE
        </span>

        <h1>
          My Favourites
        </h1>

        <p>
          Properties you have saved for
          later.
        </p>

      </section>


      <section className="favourites-properties">

        {loading && (
          <div className="loading">
            Loading favourites...
          </div>
        )}


        {!loading &&
        properties.length === 0 && (

          <div className="no-properties">

            <h3>
              No favourite properties
            </h3>

            <p>
              You haven't added any properties
              to your favourites yet.
            </p>

            <Link
              to="/"
              className="view-btn"
            >
              Explore Properties
            </Link>

          </div>

        )}


        {!loading &&
        properties.length > 0 && (

          <div className="property-grid">

            {properties.map((property) => (

              <PropertyCard
                key={property._id}
                property={property}
              />

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Favourites;