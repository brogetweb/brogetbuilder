
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "./BHKChoiceSection.css";

const bhkOptions = [
  {
    value: "1",
    title: "1 BHK",
    description: "Compact homes for independent living",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=85",
  },
  {
    value: "2",
    title: "2 BHK",
    description: "Comfortable spaces for everyday living",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=85",
  },
  {
    value: "3",
    title: "3 BHK",
    description: "Extra space for growing families",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=700&q=85",
  },
  {
    value: "4",
    title: "4 BHK",
    description: "Spacious homes with room to unwind",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=85",
  },
  {
    value: "5+",
    title: "5+ BHK",
    description: "Expansive homes for larger needs",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=700&q=85",
  },
];

function BHKChoiceSection({ userLocation,city="" }) {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true;

  const fetchProperties = async () => {
    try {
      setLoading(true);

     const params = {};
const activeCity = city?.trim() || userLocation?.city || "";

if (activeCity) {
  params.city = activeCity;
} else if (userLocation?.locality) {
  params.location = userLocation.locality;
}

      const response = await axios.get(
        `${API_URL}/properties`,
        { params }
      );

      const propertyData = Array.isArray(response.data)
        ? response.data
        : response.data.properties || [];

      if (isMounted) {
        setProperties(propertyData);
      }
    } catch (error) {
      console.error(
        "Error fetching BHK property counts:",
        error
      );

      if (isMounted) {
        setProperties([]);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchProperties();

  return () => {
    isMounted = false;
  };
}, [userLocation,city]);

  const getBHKCount = (bhkValue) => {
    return properties.filter((property) => {
      const bedrooms = Number(property.bedrooms);

      // Count only properties with a valid bedroom count.
      if (!Number.isFinite(bedrooms) || bedrooms <= 0) {
        return false;
      }

      if (bhkValue === "5+") {
        return bedrooms >= 5;
      }

      return bedrooms === Number(bhkValue);
    }).length;
  };

  const handleBHKClick = (bhk) => {
    const params = new URLSearchParams();
    params.set("bedrooms", bhk.value);

    navigate(`/buy?${params.toString()}`);
  };

  return (
    <section className="bhk-choice-section">
      <div className="bhk-choice-inner">
        <div className="bhk-choice-header">
 <div className="bhk-choice-heading">
           <div className="explore-eyebrow">
          <span>FIND YOUR PERFECT FIT</span>
          <span className="eyebrow-line"></span>
        </div>


        <h2>
  Find Your <span>Perfect Space</span>
</h2>

        </div>
        <p className="bhk-choice-subtitle">
            From cosy spaces to spacious family homes
            <br/>
             find your perfect match.
          </p>
        </div>
       

        <div className="bhk-choice-grid">
          {bhkOptions.map((bhk) => (
            <button
              type="button"
              key={bhk.value}
              className="bhk-choice-card"
              onClick={() => handleBHKClick(bhk)}
              aria-label={`Explore ${bhk.title} properties`}
            >
              <div className="bhk-choice-image-wrap">
                <img
                  src={bhk.image}
                  alt={`${bhk.title} home interior`}
                  loading="lazy"
                />

                <span className="bhk-choice-image-overlay" />

                <span className="bhk-choice-number">
                  {bhk.title}
                </span>
              </div>

              <div className="bhk-choice-content">
                <h3>{bhk.title}</h3>

                <p>{bhk.description}</p>

                <span className="bhk-choice-count">
                  {loading
                    ? "Loading properties..."
                    : `${getBHKCount(bhk.value)} ${
                        getBHKCount(bhk.value) === 1
                          ? "Property"
                          : "Properties"
                      }`}
                </span>

                <span className="bhk-choice-link">
                  Explore homes <span>→</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BHKChoiceSection;