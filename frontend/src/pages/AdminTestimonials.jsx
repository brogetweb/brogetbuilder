
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function AdminTestimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/testimonials/admin/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load pending reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const handleReview = async (id, status) => {
    try {
      setError("");
      setNotice("");

      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${API_URL}/testimonials/admin/${id}/review`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews((previous) =>
        previous.filter((review) => review._id !== id)
      );

      setNotice(
        response.data.message ||
          `Review ${status} successfully.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update this review."
      );
    }
  };

  return (
    <main className="content-page admin-testimonials">
      <section className="content-hero testimonial-hero">
        <span className="content-eyebrow">
          BUILDERBROGET ADMINISTRATION
        </span>

        <h1>Testimonial Approval</h1>

        <p>
          Review customer feedback before publishing it publicly.
        </p>
      </section>

      <section className="content-section">
        <div className="content-section-heading">
          <h2>Pending Reviews ({reviews.length})</h2>
          <p>Approve genuine reviews or reject unsuitable submissions.</p>
        </div>

        {notice && (
          <p className="content-success" role="status">
            {notice}
          </p>
        )}

        {error && (
          <p className="content-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading pending reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="content-empty">
            <span>✅</span>
            <h3>No pending reviews</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="testimonial-grid">
            {reviews.map((review) => (
              <article
                className="testimonial-card"
                key={review._id}
              >
                <div className="testimonial-stars">
                  {"★".repeat(review.rating)}
                  <span>
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="testimonial-message">
                  {review.message}
                </p>

                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {review.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{review.name}</h3>
                    <p>
                      Submitted:{" "}
                      {new Date(review.createdAt).toLocaleDateString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>

                <div className="testimonial-admin-actions">
                  <button
                    type="button"
                    className="content-primary-button"
                    onClick={() =>
                      handleReview(review._id, "approved")
                    }
                  >
                    Approve & Publish
                  </button>

                  <button
                    type="button"
                    className="testimonial-reject-button"
                    onClick={() =>
                      handleReview(review._id, "rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminTestimonials;
