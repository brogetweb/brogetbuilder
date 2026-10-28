
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "./PossessionDateSection.css";

const POSSESSION_CATEGORIES = [
  {
    id: "now",
    title: "Move in Now",
    label: "Ready to Move",
    description:
      "Explore ready-to-move-in projects and start your next chapter immediately.",
    buttonText: "View Ready Properties",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "next-year",
    title: "Next Year",
    label: "Next 12 Months",
    description:
      "Find projects expected to be ready within the next 12 months.",
    buttonText: "Explore Next Year Projects",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "later",
    title: "Later",
    label: "Future Possession",
    description:
      "Discover upcoming projects and plan your future home in advance.",
    buttonText: "Explore Later Projects",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=85",
  },
];

function getProjectsFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.projects)) return data.data.projects;

  return [];
}

// Supports dates such as "Dec 2027", "December 2027",
// "2027-12-01", and valid JavaScript date strings.
function parsePossessionDate(value) {
  if (!value || typeof value !== "string") return null;

  const text = value.trim();

  if (!text) return null;

  // Handle month + year, e.g. "Dec 2027".
  const monthYearMatch = text.match(
    /^([A-Za-z]+)[\s,/-]+(\d{4})$/
  );

  if (monthYearMatch) {
    const monthText = monthYearMatch[1].toLowerCase();
    const year = Number(monthYearMatch[2]);

    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const monthIndex = months.findIndex(
      (month) =>
        month === monthText ||
        month.startsWith(monthText)
    );

    if (monthIndex !== -1 && year >= 1900) {
      // Use the last day of the stated possession month.
      return new Date(year, monthIndex + 1, 0, 23, 59, 59);
    }
  }

  // Handle a year by itself, e.g. "2028".
  if (/^\d{4}$/.test(text)) {
    return new Date(Number(text), 11, 31, 23, 59, 59);
  }

  // Handle ISO dates and other parseable date strings.
  const parsed = new Date(text);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

function getPossessionCategory(project, now) {
  const status = String(project?.status || "")
    .trim()
    .toLowerCase();

  // Ready-to-move projects belong in the immediate category.
  if (
    status === "ready to move" ||
    status === "ready-to-move" ||
    status === "ready to move in"
  ) {
    return "now";
  }

  const possessionValue =
    project?.possessionDate ||
    project?.possession ||
    project?.possessionDateLabel ||
    "";

  const possessionDate = parsePossessionDate(
    possessionValue
  );

  // Don't guess a category when a project has no valid date.
  if (!possessionDate) return null;

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (possessionDate < today) {
    return null;
  }

  const nextYearLimit = new Date(today);
  nextYearLimit.setFullYear(today.getFullYear() + 1);

  if (possessionDate <= nextYearLimit) {
    return "next-year";
  }

  return "later";
}

function PossessionDateSection({ userLocation, city=""}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(false);

  const params = {};
const activeCity = city?.trim() || userLocation?.city || "";

if (activeCity) {
  params.city = activeCity;
}

const response = await axios.get(
  `${API_URL}/projects`,
  { params }
);

        if (!isMounted) return;

        setProjects(getProjectsFromResponse(response.data));
      } catch (err) {
        console.error(
          "Error fetching projects for possession section:",
          err
        );

        if (isMounted) {
          setProjects([]);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [userLocation,city]);

  const projectCounts = useMemo(() => {
    const now = new Date();

    const counts = {
      now: 0,
      "next-year": 0,
      later: 0,
    };

    projects.forEach((project) => {
      const category = getPossessionCategory(project, now);

      if (category && counts[category] !== undefined) {
        counts[category] += 1;
      }
    });

    return counts;
  }, [projects]);

  const handleCategoryClick = (category) => {
    // Pass the selected possession category to New Projects.
    const params = new URLSearchParams();
    params.set("possession", category.id);

    navigate(`/new-projects?${params.toString()}`);
  };

  return (
    <section className="possession-section">
      <div className="possession-section-inner">
        <div className="possession-heading">
          <span className="possession-eyebrow">
            <span className="possession-eyebrow-line" />
            POSSESSION PREFERENCE
          </span>

          <h2>Move in now, next year or later</h2>

          <p>
            Projects based on your preferred possession date.
          </p>
        </div>

        {loading && (
          <div className="possession-message">
            Loading projects...
          </div>
        )}

        {!loading && error && (
          <div className="possession-message">
            Unable to load projects right now. Please try again
            later.
          </div>
        )}

        {!loading && !error && (
          <div className="possession-grid">
            {POSSESSION_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`possession-card ${
                  category.id === "now"
                    ? "possession-card-featured"
                    : ""
                }`}
                onClick={() =>
                  handleCategoryClick(category)
                }
                aria-label={`${category.title}: explore ${projectCounts[category.id]} projects`}
              >
                <div className="possession-image-wrap">
                  <img
                    src={category.image}
                    alt={`${category.title} residential projects`}
                    className="possession-image"
                    loading="lazy"
                  />

                  <span className="possession-image-shade" />

                  <span className="possession-status-pill">
                    {category.id === "now" ? "✓" : "▦"}
                    <span>{category.label}</span>
                  </span>

                  <span className="possession-image-count">
                    {projectCounts[category.id]}{" "}
                    {projectCounts[category.id] === 1
                      ? "Project"
                      : "Projects"}
                  </span>
                </div>

                <div className="possession-card-body">
                  <div className="possession-card-title-row">
                    <span
                      className="possession-card-icon"
                      aria-hidden="true"
                    >
                      {category.id === "now" ? "⌂" : "▦"}
                    </span>

                    <h3>{category.title}</h3>
                  </div>

                  <p className="possession-description">
                    {category.description}
                  </p>

                  <span className="possession-card-button">
                    {category.buttonText}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="possession-footnote">
            Projects will appear here as listings become available.
          </p>
        )}
      </div>
    </section>
  );
}

export default PossessionDateSection;
