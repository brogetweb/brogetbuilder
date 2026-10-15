import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./Testimonials.css";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  const [form, setForm] = useState({
    name: "",
    rating: "5",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // FETCH APPROVED TESTIMONIALS
  // =====================================
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/testimonials`);

      // Support either a direct array or { testimonials: [...] }
      const data = response.data;

      const reviews = Array.isArray(data)
        ? data
        : Array.isArray(data.testimonials)
          ? data.testimonials
          : [];

      setTestimonials(reviews);
    } catch (err) {
      console.error("Error fetching testimonials:", err);

      setError(
        "Unable to load testimonials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // =====================================
  // HANDLE FORM CHANGES
  // =====================================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // SUBMIT TESTIMONIAL
  // =====================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setNotice("");
    setError("");

    const name = form.name.trim();
    const message = form.message.trim();
    const rating = Number(form.rating);

    if (!name || !message) {
      setError("Please fill in all the fields.");
      return;
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      setError("Please select a valid rating.");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`${API_URL}/testimonials`, {
        name,
        rating,
        message,
      });

      // Clear form after successful submission
      setForm({
        name: "",
        rating: "5",
        message: "",
      });

      // Simple, friendly confirmation
      setNotice("Thank you for your feedback!");

    } catch (err) {
      console.error("Error submitting testimonial:", err);

      setError(
        err.response?.data?.message ||
          "Unable to submit your feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // FORMAT DATE
  // =====================================
  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================
  // UI
  // =====================================
  return (
    <main className="content-page testimonials-page">

      {/* HERO */}
      <section className="content-hero testimonial-hero">
        <span className="content-eyebrow">
          REAL PEOPLE, REAL EXPERIENCES
        </span>

        <h1>Stories That Feel Like Home</h1>

        <p>
          Every home search has a story. Explore experiences
          from our community and share yours with HomeEstate.
        </p>
      </section>

      {/* TESTIMONIAL LIST */}
      <section className="content-section testimonial-list-section">
        <div className="content-section-heading">
          <span className="content-eyebrow">
            OUR COMMUNITY
          </span>

          <h2>What Our Customers Say</h2>

          <p>
            Experiences shared by our HomeEstate community.
          </p>
        </div>

        {loading ? (
          <div className="content-empty">
            <p>Loading testimonials...</p>
          </div>
        ) : error && testimonials.length === 0 ? (
          <div className="content-empty">
            <p>{error}</p>

            <button
              type="button"
              className="content-primary-button"
              onClick={fetchTestimonials}
            >
              Try Again
            </button>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="content-empty">
            <span>💬</span>

            <h3>Be the first to share your story</h3>

            <p>
              We would love to hear about your experience.
            </p>
          </div>
        ) : (
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article
                className="testimonial-card"
                key={item._id}
              >
                <div
                  className="testimonial-stars"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {"★".repeat(
                    Math.min(5, Math.max(0, Number(item.rating) || 0))
                  )}

                  <span>
                    {"★".repeat(
                      5 -
                        Math.min(
                          5,
                          Math.max(0, Number(item.rating) || 0)
                        )
                    )}
                  </span>
                </div>

                <span className="testimonial-quote">
                  “
                </span>

                <p className="testimonial-message">
                  {item.message}
                </p>

                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {item.name?.charAt(0).toUpperCase() || "H"}
                  </div>

                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      {formatDate(
                        item.reviewedAt || item.createdAt
                      )}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SUBMIT FEEDBACK */}
      <section className="content-section testimonial-form-section">
        <div className="content-section-heading">
          <span className="content-eyebrow">
            YOUR TURN
          </span>

          <h2>Share Your Experience</h2>

          <p>
            Have a HomeEstate story? We would love to hear
            your feedback.
          </p>
        </div>

        <form
          className="content-form"
          onSubmit={handleSubmit}
        >
          <label>
            Your Name

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              maxLength={80}
              required
            />
          </label>

          <label>
            Your Rating

            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              required
            >
              <option value="5">
                ★★★★★ — Excellent
              </option>

              <option value="4">
                ★★★★ — Very good
              </option>

              <option value="3">
                ★★★ — Good
              </option>

              <option value="2">
                ★★ — Fair
              </option>

              <option value="1">
                ★ — Needs improvement
              </option>
            </select>
          </label>

          <label>
            Your Review

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your experience..."
              rows={5}
              maxLength={1000}
              required
            />
          </label>

          {notice && (
            <p
              className="content-success"
              role="status"
            >
              {notice}
            </p>
          )}

          {error && (
            <p
              className="content-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            className="content-primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Feedback"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Testimonials;

 
