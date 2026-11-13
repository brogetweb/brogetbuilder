import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import WebsiteApp from "./website/WebsiteApp";

// The dashboard is loaded only when someone opens it, so website
// visitors never download the dashboard code (charts etc.).
const DashboardApp = lazy(() => import("./dashboard/DashboardApp"));

/*
 * Two apps live in this frontend:
 *   - src/website/   → the public user website (Navbar + Footer layout)
 *   - src/dashboard/ → the builder/owner dashboard (own sidebar layout)
 * Shared code (API config, global styles) stays in src/.
 */
function App() {
  return (
    <Routes>
      <Route
        path="/owner-dashboard/*"
        element={
          <Suspense fallback={<div className="owner-dash-loader">Loading dashboard…</div>}>
            <DashboardApp />
          </Suspense>
        }
      />

      <Route path="/*" element={<WebsiteApp />} />
    </Routes>
  );
}

export default App;
