import { Routes, Route, Navigate } from "react-router-dom";

import OwnerDashboard from "./builderDashboard/OwnerDashboard";

/*
 * Dashboard app — mounted at /owner-dashboard/* (see src/App.jsx).
 * It has its own layout (sidebar inside OwnerDashboard), so the
 * website Navbar/Footer are not rendered here.
 * Add new dashboard screens as child routes below, e.g.
 *   <Route path="leads" element={<Leads />} />  → /owner-dashboard/leads
 */
function DashboardApp() {
  return (
    <Routes>
      <Route index element={<OwnerDashboard />} />
      <Route path="*" element={<Navigate to="/owner-dashboard" replace />} />
    </Routes>
  );
}

export default DashboardApp;
