
import { useEffect, useRef, useState } from "react";

import {
  setOptions,
  importLibrary,
} from "@googlemaps/js-api-loader";



let googleMapsPromise;

function loadGoogleMaps() {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.reject(
      new Error(
        "Google Maps API key is missing. Check your frontend .env file."
      )
    );
  }

  setOptions({
    key: apiKey,
    v: "weekly",
  });

  googleMapsPromise = importLibrary("places");

  return googleMapsPromise;
}

function getCityFromPlace(place) {
  const components = place.addressComponents || [];

  const cityComponent = components.find((component) =>
    component.types.some((type) =>
      [
        "locality",
        "postal_town",
        "administrative_area_level_2",
      ].includes(type)
    )
  );

  return cityComponent?.longText || "";
}

function LocationAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Search city or locality",
  className = "",
}) {
  const [input, setInput] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [mapsReady, setMapsReady] = useState(false);

  const placesLibrary = useRef(null);
  const sessionToken = useRef(null);
  const requestNumber = useRef(0);
  const wrapperRef = useRef(null);

  // Keep the input in sync with the parent SearchBar.
  useEffect(() => {
    setInput(value || "");
  }, [value]);

  // Load Google Maps once.
  useEffect(() => {
    let cancelled = false;

  
async function initializeGoogleMaps() {
  try {
    const places = await loadGoogleMaps();

    if (cancelled) return;

    placesLibrary.current = places;

    sessionToken.current =
      new places.AutocompleteSessionToken();

    setMapsReady(true);
    setError("");
  } catch (err) {
    if (!cancelled) {
      setError(
        err.message || "Could not load Google Maps."
      );
    }
  }
}

    initializeGoogleMaps();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch suggestions after the user types at least 3 characters.
  useEffect(() => {
    const currentRequest = ++requestNumber.current;

    if (!mapsReady || input.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const { AutocompleteSuggestion } = placesLibrary.current;

        if (!sessionToken.current) {
          sessionToken.current =
            new placesLibrary.current.AutocompleteSessionToken();
        }

        const response =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: input.trim(),
            includedRegionCodes: ["in"],
            language: "en-IN",
            region: "IN",
            sessionToken: sessionToken.current,
          });

        // Ignore older responses if the user has typed again.
        if (currentRequest !== requestNumber.current) return;

        const results = (response.suggestions || [])
          .filter((item) => item.placePrediction)
          .slice(0, 5);

        setSuggestions(results);
      } catch (err) {
        console.error("Google Places Autocomplete error:", err);
        if (currentRequest === requestNumber.current) {
          setSuggestions([]);
          setError("Unable to fetch locations. Please try again.");
        }
      } finally {
        if (currentRequest === requestNumber.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input, mapsReady]);

  // Close suggestions when clicking outside the component.
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleInputChange = (event) => {
    const newValue = event.target.value;

    setInput(newValue);
    onChange(newValue);
    setError("");
  };

  const handleSelectPlace = async (suggestion) => {
    const prediction = suggestion.placePrediction;

    if (!prediction) return;

    const selectedLabel = prediction.text.toString();

    // Immediately display the selected suggestion.
    setInput(selectedLabel);
    setSuggestions([]);
    setLoading(false);
    onChange(selectedLabel);

    try {
      const place = prediction.toPlace();

      await place.fetchFields({
        fields: [
          "displayName",
          "formattedAddress",
          "addressComponents",
          "location",
        ],
      });

      const city = getCityFromPlace(place);
      const formattedAddress =
        place.formattedAddress || selectedLabel;

      const selectedLocation = {
        placeId: prediction.placeId,
        name: place.displayName || selectedLabel,
        formattedAddress,
        city: city || formattedAddress,
        latitude: place.location?.lat() ?? null,
        longitude: place.location?.lng() ?? null,
      };

      const searchValue = selectedLocation.city;

      setInput(searchValue);
      onChange(searchValue);

      if (onPlaceSelect) {
        onPlaceSelect(selectedLocation);
      }

      // A new session token is needed for the next search.
      sessionToken.current =
        new placesLibrary.current.AutocompleteSessionToken();
    } catch (err) {
      setError("Location selected, but details could not be loaded.");
    }
  };

  return (
    <div className="location-autocomplete" ref={wrapperRef}>
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={input}
        onChange={handleInputChange}
        onFocus={() => {
          if (input.trim().length >= 3) {
            // Suggestions will be fetched by the effect if needed.
          }
        }}
        autoComplete="off"
        aria-label="Search city or locality"
        aria-autocomplete="list"
      />

      {loading && (
        <div className="location-status">
          Searching locations...
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="location-suggestions" role="listbox">
          {suggestions.map((suggestion) => {
            const prediction = suggestion.placePrediction;

            return (
              <button
                type="button"
                className="location-suggestion"
                key={prediction.placeId}
                role="option"
                onClick={() => handleSelectPlace(suggestion)}
              >
                <span className="location-pin">📍</span>

                <span className="location-suggestion-text">
                  {prediction.mainText?.toString() ||
                    prediction.text.toString()}

                  {prediction.secondaryText && (
                    <small>
                      {prediction.secondaryText.toString()}
                    </small>
                  )}
                </span>
              </button>
            );
          })}

          <div className="google-attribution">
            Powered by Google
          </div>
        </div>
      )}

      {error && (
        <div className="location-error">
          {error}
        </div>
      )}
    </div>
  );
}

export default LocationAutocomplete;