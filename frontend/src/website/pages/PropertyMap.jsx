
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

import { API_URL } from "../../config";
import "./PropertyMap.css";

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return characters[character];
  });

const getLocationKey = (item) => {
  const location = item.location?.trim().toLowerCase() || "";
  const city = item.city?.trim().toLowerCase() || "";

  return `${location}, ${city}`;
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "Price on request";
  }

  return `₹${Number(price).toLocaleString("en-IN")}`;
};

const formatProjectPrice = (project) => {
  const minimum = formatPrice(project.minPrice);
  const maximum = formatPrice(project.maxPrice);

  if (
    project.minPrice === project.maxPrice ||
    !project.maxPrice
  ) {
    return minimum;
  }

  return `${minimum} - ${maximum}`;
};

function PropertyMap() {
  const location = useLocation();
  const navigate = useNavigate();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerGroupRef = useRef(null);

  const coordinateCacheRef = useRef(new Map());

  const mapType =
    location.state?.mapType === "project"
      ? "project"
      : "property";

  const [items, setItems] = useState(
    Array.isArray(location.state?.items)
      ? location.state.items
      : []
  );

  const [coordinates, setCoordinates] = useState({});
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);

  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
  });

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState(
    location.state?.city || ""
  );

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadItems = async () => {
      if (
        Array.isArray(location.state?.items) &&
        location.state.items.length > 0
      ) {
        setItems(location.state.items);
        return;
      }

      try {
        setLoadingItems(true);
        setError("");

        const endpoint =
          mapType === "project"
            ? `${API_URL}/projects`
            : `${API_URL}/properties`;

        const response = await axios.get(endpoint);

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.properties ||
            response.data.projects ||
            response.data.data ||
            [];

        if (!cancelled) {
          setItems(data);
        }
      } catch (err) {
        console.error("Error loading map data:", err);

        if (!cancelled) {
          setError(
            `Unable to load ${
              mapType === "project" ? "projects" : "properties"
            }. Please try again.`
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingItems(false);
        }
      }
    };

    loadItems();

    return () => {
      cancelled = true;
    };
  }, [location.state, mapType]);

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCity = cityFilter
        ? item.city?.toLowerCase().includes(
            cityFilter.toLowerCase()
          )
        : true;

      const searchText = search.trim().toLowerCase();

      const searchableFields =
        mapType === "project"
          ? [
              item.name,
              item.builder,
              item.location,
              item.city,
              item.propertyType,
              item.status,
              ...(item.configurations || []),
            ]
          : [
              item.title,
              item.location,
              item.city,
              item.propertyType,
              item.listingType,
            ];

      const matchesSearch = searchText
        ? searchableFields.some((value) =>
            String(value || "")
              .toLowerCase()
              .includes(searchText)
          )
        : true;

      return matchesCity && matchesSearch;
    });
  }, [items, cityFilter, search, mapType]);

  useEffect(() => {
    let cancelled = false;

    const geocodeLocations = async () => {
      const uniqueItems = [
        ...new Map(
          items
            .filter((item) => item.location && item.city)
            .map((item) => [
              getLocationKey(item),
              item,
            ])
        ).values(),
      ];

      setLoadingMap(true);

      setProgress({
        completed: 0,
        total: uniqueItems.length,
      });

      let completed = 0;

      for (const item of uniqueItems) {
        if (cancelled) break;

        const key = getLocationKey(item);

        if (coordinateCacheRef.current.has(key)) {
          completed++;

          setProgress({
            completed,
            total: uniqueItems.length,
          });

          continue;
        }

        try {
          const address =
            `${item.location}, ${item.city}, India`;

          const url =
            "https://nominatim.openstreetmap.org/search?" +
            new URLSearchParams({
              format: "jsonv2",
              q: address,
              limit: "1",
            });

          const response = await fetch(url, {
            headers: {
              "Accept-Language": "en",
            },
          });

          if (response.status === 429) {
            console.warn(
              "Nominatim request limit reached."
            );
            break;
          }

          if (!response.ok) {
            throw new Error("Location lookup failed");
          }

          const results = await response.json();

          if (results.length > 0) {
            const point = {
              lat: Number(results[0].lat),
              lng: Number(results[0].lon),
            };

            coordinateCacheRef.current.set(key, point);

            if (!cancelled) {
              setCoordinates((previous) => ({
                ...previous,
                [key]: point,
              }));
            }
          }
        } catch (err) {
          console.error(
            `Unable to locate ${key}:`,
            err
          );
        }

        completed++;

        if (!cancelled) {
          setProgress({
            completed,
            total: uniqueItems.length,
          });
        }
        await delay(1100);
      }

      if (!cancelled) {
        setLoadingMap(false);
      }
    };

    if (items.length > 0) {
      geocodeLocations();
    } else {
      setLoadingMap(false);
    }

    return () => {
      cancelled = true;
    };
  }, [items]);


  useEffect(() => {
    if (
      !mapContainerRef.current ||
      mapInstanceRef.current
    ) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map) return;

    if (markerGroupRef.current) {
      map.removeLayer(markerGroupRef.current);
    }

    const markerGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 55,

      iconCreateFunction: (cluster) => {
        return L.divIcon({
          html: `
            <div class="bb-cluster-marker">
              ${cluster.getChildCount()}
            </div>
          `,
          className: "bb-cluster-wrapper",
          iconSize: [42, 42],
        });
      },
    });

    const bounds = [];

    visibleItems.forEach((item) => {
      const point = coordinates[getLocationKey(item)];

      if (!point) return;

      const verified = item.verified === true;

      const markerIcon = L.divIcon({
        className: "bb-property-marker-wrapper",

        html: `
          <div class="bb-property-marker ${
            verified ? "verified" : "regular"
          }">
            ${
              verified
                ? '<span class="marker-check">✓</span>'
                : '<span class="marker-dot"></span>'
            }
          </div>
        `,

        iconSize: [32, 38],
        iconAnchor: [16, 36],
      });

      const marker = L.marker(
        [point.lat, point.lng],
        { icon: markerIcon }
      );

      const image =
        item.images?.[0] ||
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500";

      const title =
        mapType === "project"
          ? item.name
          : item.title;

      const price =
        mapType === "project"
          ? formatProjectPrice(item)
          : formatPrice(item.price);

      const details =
        mapType === "project"
          ? `
              <div class="bb-popup-details">
                ${escapeHTML(item.builder || "")}
              </div>

              <div class="bb-popup-details">
                ${escapeHTML(item.status || "")}
              </div>

              <div class="bb-popup-details">
                Possession: ${escapeHTML(item.possession || "Not specified")}
              </div>

              <div class="bb-popup-details">
                ${escapeHTML(
                  (item.configurations || []).join(", ")
                )}
              </div>
            `
          : `
              <div class="bb-popup-details">
                ${escapeHTML(item.propertyType || "")}
                ${
                  item.bedrooms
                    ? ` · ${item.bedrooms} BHK`
                    : ""
                }
              </div>
            `;

      const detailsPath =
        mapType === "project"
          ? `/project/${item._id}`
          : `/property/${item._id}`;

      const popupContent = `
        <div class="bb-map-popup">

          <img
            class="bb-popup-image"
            src="${escapeHTML(image)}"
            alt="${escapeHTML(title || "Listing")}"
          />

          <div class="bb-popup-content">

            <div class="bb-popup-price">
              ${escapeHTML(price)}
            </div>

            <h3>
              ${escapeHTML(title || "Listing")}
            </h3>

            <p>
              ${escapeHTML(item.location || "")},
              ${escapeHTML(item.city || "")}
            </p>

            ${details}

            ${
              verified
                ? '<span class="bb-popup-verified">✓ Verified</span>'
                : ""
            }

            <button
              class="bb-popup-button"
              data-details-path="${escapeHTML(detailsPath)}"
            >
              View ${mapType === "project" ? "Project" : "Property"}
            </button>

          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 290,
        minWidth: 240,
      });

      markerGroup.addLayer(marker);

      bounds.push([point.lat, point.lng]);
    });

    map.addLayer(markerGroup);
    markerGroupRef.current = markerGroup;

    if (bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 14,
      });
    } else {
      map.setView([20.5937, 78.9629], 5);
    }

    const handlePopupClick = (event) => {
      const button = event.target.closest(
        "[data-details-path]"
      );

      if (!button) return;

      navigate(button.dataset.detailsPath);
    };

    map.getContainer().addEventListener(
      "click",
      handlePopupClick
    );

    return () => {
      map.getContainer().removeEventListener(
        "click",
        handlePopupClick
      );
    };
  }, [visibleItems, coordinates, mapType, navigate]);

  const handleFullscreen = () => {
    const container = mapContainerRef.current;

    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const locatedCount = visibleItems.filter(
    (item) => coordinates[getLocationKey(item)]
  ).length;

  const heading =
    mapType === "project"
      ? "Explore New Projects on Map"
      : "Explore Properties on Map";

  return (
    <div className="bb-property-map-page">

      <div className="bb-map-header">

        <button
          className="bb-map-back"
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="bb-map-heading">
          <span>BUILDERBROGET</span>
          <h1>{heading}</h1>
          <p>
            {mapType === "project"
              ? "Explore developments, builders and project locations."
              : "Discover properties across your preferred locations."}
          </p>
        </div>

        <div className="bb-map-count">
          <strong>{visibleItems.length}</strong>
          <span>
            {mapType === "project" ? "Projects" : "Properties"}
          </span>
        </div>

      </div>

      {(loadingItems || loadingMap) && (
        <div className="bb-map-status" role="status">
          {loadingItems
            ? "Loading listings..."
            : `Locating ${mapType === "project" ? "projects" : "properties"}: ${progress.completed} / ${progress.total}`}
        </div>
      )}

      {error && (
        <div className="bb-map-error">
          {error}
        </div>
      )}

      <div className="bb-map-container">

        <div
          ref={mapContainerRef}
          className="bb-leaflet-map"
        />

        <button
          className="bb-map-fullscreen"
          type="button"
          onClick={handleFullscreen}
          title="Toggle fullscreen"
        >
          ⛶
        </button>

        <div className="bb-map-legend">

          <div>
            <span className="legend-dot blue"></span>
            Regular {mapType === "project" ? "Project" : "Property"}
          </div>

          <div>
            <span className="legend-dot green"></span>
            Verified {mapType === "project" ? "Project" : "Property"}
          </div>

        </div>

      </div>

      <div className="bb-map-footer">

        <span>
          {locatedCount} of {visibleItems.length} listings located on the map
        </span>

        <span>
          Map pins may represent a locality rather than an exact building.
        </span>

      </div>

    </div>
  );
}

export default PropertyMap;
