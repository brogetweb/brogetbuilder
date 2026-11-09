// ----------------------------------
// UNIQUE VISITOR ID
// ----------------------------------

export const getVisitorId = () => {
  let visitorId = localStorage.getItem(
    "builderbroget_visitor_id"
  );

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    localStorage.setItem(
      "builderbroget_visitor_id",
      visitorId
    );
  }

  return visitorId;
};


// ----------------------------------
// SESSION ID
// ----------------------------------

export const getSessionId = () => {
  let sessionId = sessionStorage.getItem(
    "builderbroget_session_id"
  );

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    sessionStorage.setItem(
      "builderbroget_session_id",
      sessionId
    );
  }

  return sessionId;
};


// ----------------------------------
// DETECT DEVICE
// ----------------------------------

export const getDevice = () => {
  const ua = navigator.userAgent;

  if (/iPad|Tablet/i.test(ua)) {
    return "Tablet";
  }

  if (/Mobi|Android|iPhone/i.test(ua)) {
    return "Mobile";
  }

  return "Desktop";
};


export const getBrowser = () => {
  const ua = navigator.userAgent;

  if (/Edg/i.test(ua)) return "Edge";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/OPR|Opera/i.test(ua)) return "Opera";
  if (/Chrome/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua)) return "Safari";

  return "Other";
};

export const getTrafficSource = () => {
  const params = new URLSearchParams(
    window.location.search
  );

  const utmSource = params.get("utm_source");

  if (utmSource) {
    const source = utmSource.toLowerCase();

    if (source.includes("google")) return "Google";
    if (source.includes("instagram")) return "Instagram";
    if (source.includes("facebook")) return "Facebook";
    if (source.includes("youtube")) return "YouTube";

    return "Other";
  }

  const referrer = document.referrer;

  if (!referrer) return "Direct";

  try {
    const hostname = new URL(referrer).hostname
      .toLowerCase()
      .replace(/^www\./, "");

    if (
      hostname === "google.com" ||
      hostname.endsWith(".google.com")
    ) {
      return "Google";
    }

    if (
      hostname === "instagram.com" ||
      hostname.endsWith(".instagram.com")
    ) {
      return "Instagram";
    }

    if (
      hostname === "facebook.com" ||
      hostname.endsWith(".facebook.com") ||
      hostname === "fb.com"
    ) {
      return "Facebook";
    }

    if (
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com") ||
      hostname === "youtu.be"
    ) {
      return "YouTube";
    }

    return "Other";

  } catch {
    return "Other";
  }
};