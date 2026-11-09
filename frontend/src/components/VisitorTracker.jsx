import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../config";

import {
  getVisitorId,
  getSessionId,
  getDevice,
  getBrowser,
  getTrafficSource,
} from "../utils/visitorTracking";

function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitorId = getVisitorId();
        const sessionId = getSessionId();

        const source = getTrafficSource();

        const params = new URLSearchParams(
          window.location.search
        );

        await axios.post(
          `${API_URL}/website-analytics/track`,
          {
            visitorId,
            sessionId,

            page: location.pathname,

            source,

            referrer: document.referrer,

            campaign:
              params.get("utm_campaign") || "",

            device: getDevice(),

            browser: getBrowser(),
          }
        );

      } catch (error) {
        console.error(
          "Website tracking error:",
          error.message
        );
      }
    };

    trackVisit();

  }, [location.pathname]);

  return null;
}

export default VisitorTracker;