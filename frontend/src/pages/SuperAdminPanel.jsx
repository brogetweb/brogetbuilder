
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./SuperAdminPanel.css";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// function SuperAdminPanel() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const api = useMemo(
//     () =>
//       axios.create({
//         baseURL: API,
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//     [token]
//   );

//   const [stats, setStats] = useState(null);
//   const [applications, setApplications] = useState([]);
//   const [filter, setFilter] = useState("pending");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [processingId, setProcessingId] = useState("");
//   const [rejectingId, setRejectingId] = useState("");
//   const [rejectionReason, setRejectionReason] = useState("");

//   const loadDashboard = useCallback(async () => {
//     if (!token) {
//       navigate("/login", { replace: true });
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const [statsResponse, applicationsResponse] = await Promise.all([
//         api.get("/admin/stats"),
//         api.get("/admin/owner-applications", {
//           params: { status: filter },
//         }),
//       ]);

//       setStats(statsResponse.data);
//       setApplications(
//         applicationsResponse.data.applications ||
//           applicationsResponse.data
//       );
//     } catch (err) {
//       const statusCode = err.response?.status;

//       if (statusCode === 401 || statusCode === 403) {
//         setError("Super Admin access is required to open this panel.");
//       } else {
//         setError(
//           err.response?.data?.message ||
//             "Unable to load the Super Admin dashboard."
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [api, filter, navigate, token]);

//   useEffect(() => {
//     loadDashboard();
//   }, [loadDashboard]);

//   const approveOwner = async (ownerId) => {
//     const confirmed = window.confirm(
//       "Approve this owner application?"
//     );

//     if (!confirmed) return;

//     try {
//       setProcessingId(ownerId);
//       setError("");
//       setMessage("");

//       await api.patch(`/admin/owner-applications/${ownerId}/approve`);

//       setMessage("Owner application approved successfully.");
//       await loadDashboard();
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Could not approve the application."
//       );
//     } finally {
//       setProcessingId("");
//     }
//   };

//   const rejectOwner = async (ownerId) => {
//     if (!rejectionReason.trim()) {
//       setError("Please enter a reason before rejecting the application.");
//       return;
//     }

//     try {
//       setProcessingId(ownerId);
//       setError("");
//       setMessage("");

//       await api.patch(`/admin/owner-applications/${ownerId}/reject`, {
//         reason: rejectionReason.trim(),
//       });

//       setMessage("Owner application rejected.");
//       setRejectingId("");
//       setRejectionReason("");
//       await loadDashboard();
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Could not reject the application."
//       );
//     } finally {
//       setProcessingId("");
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login", { replace: true });
//   };

//   return (
//     <main className="admin-page">
//       <header className="admin-header">
//         <div>
//           <p className="admin-eyebrow">HOMEESTATE CONTROL CENTRE</p>
//           <h1>Super Admin Panel</h1>
//           <p>Manage owner applications and platform access.</p>
//         </div>

//         <button className="admin-logout" onClick={logout}>
//           Log out
//         </button>
//       </header>

//       {error && <div className="admin-alert admin-alert-error">{error}</div>}
//       {message && (
//         <div className="admin-alert admin-alert-success">{message}</div>
//       )}

//       <section className="admin-stats">
//         <div className="admin-stat">
//           <span>Total users</span>
//           <strong>{stats?.users ?? "—"}</strong>
//         </div>
//         <div className="admin-stat">
//           <span>Pending applications</span>
//           <strong>{stats?.pendingOwners ?? "—"}</strong>
//         </div>
//         <div className="admin-stat">
//           <span>Approved owners</span>
//           <strong>{stats?.approvedOwners ?? "—"}</strong>
//         </div>
//         <div className="admin-stat">
//           <span>Rejected applications</span>
//           <strong>{stats?.rejectedOwners ?? "—"}</strong>
//         </div>
//       </section>

//       <section className="admin-applications">
//         <div className="admin-section-heading">
//           <div>
//             <h2>Owner applications</h2>
//             <p>Review applications submitted by prospective property owners.</p>
//           </div>

//           <button
//             className="admin-refresh"
//             onClick={loadDashboard}
//             disabled={loading}
//           >
//             ↻ Refresh
//           </button>
//         </div>

//         <div className="admin-filters">
//           {["pending", "approved", "rejected", "all"].map((status) => (
//             <button
//               key={status}
//               className={filter === status ? "active" : ""}
//               onClick={() => setFilter(status)}
//             >
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </button>
//           ))}
//         </div>

//         {loading ? (
//           <div className="admin-empty">Loading applications...</div>
//         ) : applications.length === 0 ? (
//           <div className="admin-empty">
//             <span>✦</span>
//             <h3>No applications found</h3>
//             <p>There are no owner applications in this category.</p>
//           </div>
//         ) : (
//           <div className="admin-table-wrap">
//             <table className="admin-table">
//               <thead>
//                 <tr>
//                   <th>Owner</th>
//                   <th>Email</th>
//                   <th>Submitted</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {applications.map((owner) => (
//                   <tr key={owner._id}>
//                     <td>
//                       <strong>{owner.name}</strong>
//                     </td>
//                     <td>{owner.email}</td>
//                     <td>
//                       {owner.createdAt
//                         ? new Date(owner.createdAt).toLocaleDateString()
//                         : "—"}
//                     </td>
//                     <td>
//                       <span
//                         className={`admin-status status-${owner.approvalStatus}`}
//                       >
//                         {owner.approvalStatus}
//                       </span>
//                     </td>
//                     <td>
//                       {owner.approvalStatus === "pending" ? (
//                         <div className="admin-actions">
//                           <button
//                             className="admin-approve"
//                             disabled={processingId === owner._id}
//                             onClick={() => approveOwner(owner._id)}
//                           >
//                             Approve
//                           </button>

//                           <button
//                             className="admin-reject"
//                             disabled={processingId === owner._id}
//                             onClick={() => {
//                               setRejectingId(owner._id);
//                               setRejectionReason("");
//                               setError("");
//                             }}
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       ) : (
//                         <span className="admin-no-action">
//                           {owner.rejectionReason || "Reviewed"}
//                         </span>
//                       )}

//                       {rejectingId === owner._id && (
//                         <div className="admin-reject-form">
//                           <label htmlFor={`reason-${owner._id}`}>
//                             Reason for rejection
//                           </label>
//                           <textarea
//                             id={`reason-${owner._id}`}
//                             value={rejectionReason}
//                             onChange={(e) =>
//                               setRejectionReason(e.target.value)
//                             }
//                             placeholder="Explain why this application is rejected"
//                             rows={3}
//                           />

//                           <div className="admin-actions">
//                             <button
//                               className="admin-reject"
//                               disabled={processingId === owner._id}
//                               onClick={() => rejectOwner(owner._id)}
//                             >
//                               Confirm rejection
//                             </button>
//                             <button
//                               className="admin-cancel"
//                               onClick={() => setRejectingId("")}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// export default SuperAdminPanel;

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL as API } from "../config";
import "./SuperAdminPanel.css";
import AdminContactMessages from "../components/AdminContactMessages";

function SuperAdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ==========================================
  // AUTHENTICATED API INSTANCE
  // ==========================================

  const api = useMemo(
    () =>
      axios.create({
        baseURL: API,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    [token]
  );

  // ==========================================
  // DASHBOARD STATE
  // ==========================================

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("pending");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [processingId, setProcessingId] = useState("");
  const [rejectingId, setRejectingId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // ==========================================
  // TESTIMONIAL STATE
  // ==========================================

  const [testimonials, setTestimonials] = useState([]);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [testimonialError, setTestimonialError] = useState("");
  const [testimonialMessage, setTestimonialMessage] = useState("");
  const [testimonialProcessingId, setTestimonialProcessingId] =
    useState("");

  // ==========================================
  // LOAD DASHBOARD AND OWNER APPLICATIONS
  // ==========================================

  const loadDashboard = useCallback(async () => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [statsResponse, applicationsResponse] =
        await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/owner-applications", {
            params: { status: filter },
          }),
        ]);

      setStats(statsResponse.data);

      setApplications(
        applicationsResponse.data.applications ||
          applicationsResponse.data
      );
    } catch (err) {
      const statusCode = err.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        setError(
          "Super Admin access is required to open this panel."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load the Super Admin dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [api, filter, navigate, token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ==========================================
  // LOAD PENDING TESTIMONIALS
  // ==========================================

  const loadPendingTestimonials = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setTestimonialLoading(true);
      setTestimonialError("");

      const response = await api.get(
        "/testimonials/admin/pending"
      );

      setTestimonials(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      setTestimonials([]);

      setTestimonialError(
        err.response?.data?.message ||
          "Unable to load pending testimonials."
      );
    } finally {
      setTestimonialLoading(false);
    }
  }, [api, token]);

  useEffect(() => {
    loadPendingTestimonials();
  }, [loadPendingTestimonials]);

  // ==========================================
  // APPROVE OWNER APPLICATION
  // ==========================================

  const approveOwner = async (ownerId) => {
    const confirmed = window.confirm(
      "Approve this owner application?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(ownerId);
      setError("");
      setMessage("");

      await api.patch(
        `/admin/owner-applications/${ownerId}/approve`
      );

      setMessage("Owner application approved successfully.");

      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not approve the application."
      );
    } finally {
      setProcessingId("");
    }
  };

  // ==========================================
  // REJECT OWNER APPLICATION
  // ==========================================

  const rejectOwner = async (ownerId) => {
    if (!rejectionReason.trim()) {
      setError(
        "Please enter a reason before rejecting the application."
      );
      return;
    }

    try {
      setProcessingId(ownerId);
      setError("");
      setMessage("");

      await api.patch(
        `/admin/owner-applications/${ownerId}/reject`,
        {
          reason: rejectionReason.trim(),
        }
      );

      setMessage("Owner application rejected successfully.");

      setRejectingId("");
      setRejectionReason("");

      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not reject the application."
      );
    } finally {
      setProcessingId("");
    }
  };

  // ==========================================
  // APPROVE OR REJECT TESTIMONIAL
  // ==========================================

  const reviewTestimonial = async (testimonialId, status) => {
    const action = status === "approved" ? "publish" : "reject";

    const confirmed = window.confirm(
      status === "approved"
        ? "Approve and publish this testimonial?"
        : "Are you sure you want to reject this testimonial?"
    );

    if (!confirmed) return;

    try {
      setTestimonialProcessingId(testimonialId);
      setTestimonialError("");
      setTestimonialMessage("");

      const response = await api.patch(
        `/testimonials/admin/${testimonialId}/review`,
        { status }
      );

      // Remove reviewed testimonial from pending list.
      setTestimonials((previous) =>
        previous.filter(
          (review) => review._id !== testimonialId
        )
      );

      setTestimonialMessage(
        response.data.message ||
          `Testimonial ${action} successfully.`
      );
    } catch (err) {
      setTestimonialError(
        err.response?.data?.message ||
          `Could not ${action} the testimonial.`
      );
    } finally {
      setTestimonialProcessingId("");
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <main className="admin-page">
      {/* ======================================
          DASHBOARD HEADER
      ====================================== */}

      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">
            HOMEESTATE CONTROL CENTRE
          </p>

          <h1>Super Admin Panel</h1>

          <p>
            Manage owner applications, testimonials, and platform
            access.
          </p>
        </div>

        <button className="admin-logout" onClick={logout}>
          Log out
        </button>
      </header>

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      {message && (
        <div className="admin-alert admin-alert-success">
          {message}
        </div>
      )}

      {/* ======================================
          DASHBOARD STATISTICS
      ====================================== */}

      <section className="admin-stats">
        <div className="admin-stat">
          <span>Total users</span>
          <strong>{stats?.users ?? "—"}</strong>
        </div>

        <div className="admin-stat">
          <span>Pending applications</span>
          <strong>{stats?.pendingOwners ?? "—"}</strong>
        </div>

        <div className="admin-stat">
          <span>Approved owners</span>
          <strong>{stats?.approvedOwners ?? "—"}</strong>
        </div>

        <div className="admin-stat">
          <span>Rejected applications</span>
          <strong>{stats?.rejectedOwners ?? "—"}</strong>
        </div>
      </section>

      {/* ======================================
          OWNER APPLICATIONS
      ====================================== */}

      <section className="admin-applications">
        <div className="admin-section-heading">
          <div>
            <h2>Owner applications</h2>

            <p>
              Review applications submitted by prospective
              property owners.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh"
            onClick={loadDashboard}
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        <div className="admin-filters">
          {["pending", "approved", "rejected", "all"].map(
            (status) => (
              <button
                type="button"
                key={status}
                className={filter === status ? "active" : ""}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1)}
              </button>
            )
          )}
        </div>

        {loading ? (
          <div className="admin-empty">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="admin-empty">
            <span>✦</span>
            <h3>No applications found</h3>
            <p>
              There are no owner applications in this category.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((owner) => (
                  <tr key={owner._id}>
                    <td>
                      <strong>{owner.name}</strong>
                    </td>

                    <td>{owner.email}</td>

                    <td>
                      {owner.createdAt
                        ? new Date(
                            owner.createdAt
                          ).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td>
                      <span
                        className={`admin-status status-${owner.approvalStatus}`}
                      >
                        {owner.approvalStatus}
                      </span>
                    </td>

                    <td>
                      {owner.approvalStatus === "pending" ? (
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-approve"
                            disabled={processingId === owner._id}
                            onClick={() =>
                              approveOwner(owner._id)
                            }
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            className="admin-reject"
                            disabled={processingId === owner._id}
                            onClick={() => {
                              setRejectingId(owner._id);
                              setRejectionReason("");
                              setError("");
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="admin-no-action">
                          {owner.rejectionReason || "Reviewed"}
                        </span>
                      )}

                      {rejectingId === owner._id && (
                        <div className="admin-reject-form">
                          <label htmlFor={`reason-${owner._id}`}>
                            Reason for rejection
                          </label>

                          <textarea
                            id={`reason-${owner._id}`}
                            value={rejectionReason}
                            onChange={(event) =>
                              setRejectionReason(
                                event.target.value
                              )
                            }
                            placeholder="Explain why this application is rejected"
                            rows={3}
                          />

                          <div className="admin-actions">
                            <button
                              type="button"
                              className="admin-reject"
                              disabled={
                                processingId === owner._id
                              }
                              onClick={() =>
                                rejectOwner(owner._id)
                              }
                            >
                              Confirm rejection
                            </button>

                            <button
                              type="button"
                              className="admin-cancel"
                              onClick={() => {
                                setRejectingId("");
                                setRejectionReason("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ======================================
          TESTIMONIAL APPROVALS
      ====================================== */}

      <section className="admin-applications admin-testimonials-section">
        <div className="admin-section-heading">
          <div>
            <p className="admin-eyebrow">
              COMMUNITY MANAGEMENT
            </p>

            <h2>Testimonial Approvals</h2>

            <p>
              Review customer feedback before publishing it
              on HomeEstate.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh"
            onClick={loadPendingTestimonials}
            disabled={testimonialLoading}
          >
            {testimonialLoading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {/* Pending testimonial count */}

        <div className="admin-testimonial-summary">
          <span>Pending testimonials</span>
          <strong>{testimonials.length}</strong>
        </div>

        {testimonialMessage && (
          <div
            className="admin-alert admin-alert-success"
            role="status"
          >
            {testimonialMessage}
          </div>
        )}

        {testimonialError && (
          <div
            className="admin-alert admin-alert-error"
            role="alert"
          >
            {testimonialError}
          </div>
        )}

        {testimonialLoading ? (
          <div className="admin-empty">
            Loading pending testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="admin-empty">
            <span>✦</span>
            <h3>No pending testimonials</h3>
            <p>
              All submitted reviews have been reviewed.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {testimonials.map((review) => (
                  <tr key={review._id}>
                    <td>
                      <strong>{review.name}</strong>
                    </td>

                    <td>
                      <span className="admin-testimonial-stars">
                        {"★".repeat(review.rating)}
                        <span>
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </span>

                      <small> {review.rating}/5</small>
                    </td>

                    <td className="admin-testimonial-review">
                      {review.message}
                    </td>

                    <td>
                      {review.createdAt
                        ? new Date(
                            review.createdAt
                          ).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-approve"
                          disabled={
                            testimonialProcessingId === review._id
                          }
                          onClick={() =>
                            reviewTestimonial(
                              review._id,
                              "approved"
                            )
                          }
                        >
                          {testimonialProcessingId === review._id
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          className="admin-reject"
                          disabled={
                            testimonialProcessingId === review._id
                          }
                          onClick={() =>
                            reviewTestimonial(
                              review._id,
                              "rejected"
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-contact-messages-section">
        <AdminContactMessages/>
      </section>
    </main>
  );
}

export default SuperAdminPanel;
