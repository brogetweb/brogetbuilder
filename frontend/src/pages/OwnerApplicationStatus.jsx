
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OwnerApplicationStatus.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function OwnerApplicationStatus() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkStatus = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const currentUser = response.data.user || response.data;
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));

      if (currentUser.role === "superadmin") {
        navigate("/super-admin", { replace: true });
      } else if (currentUser.role !== "owner") {
        navigate("/", { replace: true });
      } else if (currentUser.approvalStatus === "approved") {
        navigate("/owner-dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't check your application status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (!user || user.approvalStatus !== "pending") return;

    const interval = setInterval(() => {
      checkStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, checkStatus]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (loading && !user) {
    return (
      <main className="application-page">
        <div className="application-card">
          <div className="application-spinner" />
          <p>Checking your application...</p>
        </div>
      </main>
    );
  }

  const isRejected = user?.approvalStatus === "rejected";

  return (
    <main className="application-page">
      <section className="application-card">
        <div
          className={`application-icon ${isRejected ? "rejected" : ""}`}
          aria-hidden="true"
        >
          {isRejected ? "!" : "◷"}
        </div>

        <p className="application-eyebrow">HOMEESTATE OWNER REGISTRATION</p>

        <h1>
          {isRejected
            ? "Application not approved"
            : "Your application is under review"}
        </h1>

        <p className="application-description">
          {isRejected
            ? "Thank you for your interest in HomeEstate. Unfortunately, your owner application has not been approved."
            : "Thank you for registering as a property owner. Our Super Admin is reviewing your application."}
        </p>

        {!isRejected && (
          <div className="application-timeline">
            <div className="timeline-icon">✓</div>
            <div>
              <strong>Application submitted</strong>
              <p>Your registration details have been received.</p>
            </div>

            <div className="timeline-icon timeline-pending">◷</div>
            <div>
              <strong>Review in progress</strong>
              <p>
                We will update you within <strong>24 hours</strong>.
              </p>
            </div>

            <div className="timeline-icon timeline-waiting">3</div>
            <div>
              <strong>Owner access</strong>
              <p>
                Your owner dashboard will become available once your
                application is approved.
              </p>
            </div>
          </div>
        )}

        {isRejected && user?.rejectionReason && (
          <div className="application-reason">
            <strong>Reason provided</strong>
            <p>{user.rejectionReason}</p>
          </div>
        )}

        {error && (
          <div className="application-error" role="alert">
            {error}
          </div>
        )}

        <button
          className="application-primary"
          onClick={checkStatus}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Application Status"}
        </button>

        <Link className="application-home" to="/">
          ← Back to Home
        </Link>

        <button className="application-logout" onClick={handleLogout}>
          Log out
        </button>
      </section>
    </main>
  );
}

export default OwnerApplicationStatus;