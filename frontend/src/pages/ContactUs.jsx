import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../config";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  budget: 2,
  message: "",
  hasLand: "",
  timeline: "",
};

const budgetOptions = [
  "Below ₹25L",
  "₹25L–50L",
  "₹50L–1Cr",
  "₹1Cr–2Cr",
  "₹2Cr+",
];

const ContactUs = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const message = [
      `Project Type: ${formData.projectType}`,
      `Estimated Budget: ${budgetOptions[formData.budget]}`,
      `Land Available: ${formData.hasLand}`,
      `Project Timeline: ${formData.timeline}`,
      "",
      "Project Details:",
      formData.message.trim(),
    ].join("\n");

    try {
      setSubmitting(true);

      await axios.post(`${API_URL}/contact`, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message,
      });

      toast.success(
        `Thank you, ${formData.name.trim()}! Your enquiry has been submitted successfully.`,
        {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        }
      );

      setFormData(initialFormData);
    } catch (error) {
      console.error("Contact form submission error:", error);

      toast.error(
        error.response?.data?.message ||
          "We couldn't submit your enquiry. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSchedule = () => {
    document.getElementById("contact-name")?.focus();
  };

  return (
    <div className="contact-page">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <main className="contact-shell">
        <header className="contact-header">
          <span className="contact-eyebrow">
            BUILDER BROGET <span aria-hidden="true">·</span>{" "}
            YOUR VISION, OUR COMMITMENT
          </span>

          <h1>LET’S BUILD YOUR VISION</h1>

          <p>
            Every great space starts with an idea. Whether you're planning
            your dream home, exploring a new property, or considering an
            investment, let's turn your vision into your next big step.
          </p>
        </header>

        <div className="contact-layout">
          <section className="contact-form-card">
            <div className="form-heading">
              <span className="form-step">
                01 / TELL US YOUR PLANS
              </span>

              <h2>Tell Us About Your Project</h2>

              <p>
                Share a few details with us so we can understand what
                you're looking for.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-input-grid">
                <div className="field-group">
                  <label htmlFor="contact-name">Full Name *</label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={100}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="contact-email">
                    Email Address *
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    maxLength={254}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="contact-phone">Phone Number *</label>

                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit mobile number"
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit contact number"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="contact-input-grid">
                <div className="field-group">
                  <label htmlFor="contact-project">
                    Project Type *
                  </label>

                  <select
                    id="contact-project"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  >
                    <option value="" disabled>
                      Choose a project
                    </option>
                    <option value="Custom Home">Custom Home</option>
                    <option value="Home Construction">
                      Home Construction
                    </option>
                    <option value="Renovation">Renovation</option>
                    <option value="Commercial Project">
                      Commercial Project
                    </option>
                    <option value="Residential Property">
                      Residential Property
                    </option>
                    <option value="Plot or Land">Plot or Land</option>
                    <option value="Property Investment">
                      Property Investment
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="field-group budget-group">
                  <div className="budget-label-row">
                    <label htmlFor="contact-budget">
                      Estimated Budget
                    </label>

                    <span className="budget-value">
                      {budgetOptions[formData.budget]}
                    </span>
                  </div>

                  <input
                    id="contact-budget"
                    className="budget-slider"
                    type="range"
                    name="budget"
                    min="0"
                    max="4"
                    step="1"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budget: Number(e.target.value),
                      }))
                    }
                    aria-valuetext={budgetOptions[formData.budget]}
                    disabled={submitting}
                  />

                  <div className="budget-scale">
                    <span>₹25L</span>
                    <span>₹1Cr</span>
                    <span>₹2Cr+</span>
                  </div>
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="contact-message">
                  Tell Us More About Your Plans *
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Preferred location, property requirements, design ideas, or investment goals..."
                  rows={4}
                  maxLength={3000}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="contact-input-grid contact-choice-grid">
                <fieldset className="choice-group">
                  <legend>Do You Already Have Land? *</legend>

                  <div className="choice-options">
                    {["Yes", "No"].map((option) => (
                      <label className="choice-option" key={option}>
                        <input
                          type="radio"
                          name="hasLand"
                          value={option}
                          checked={formData.hasLand === option}
                          onChange={handleChange}
                          required
                          disabled={submitting}
                        />

                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="choice-group">
                  <legend>When Do You Plan to Start? *</legend>

                  <div className="choice-options choice-options-wrap">
                    {["Immediate", "3–6 months", "6+ months"].map(
                      (option) => (
                        <label
                          className="choice-option"
                          key={option}
                        >
                          <input
                            type="radio"
                            name="timeline"
                            value={option}
                            checked={formData.timeline === option}
                            onChange={handleChange}
                            required
                            disabled={submitting}
                          />

                          <span>{option}</span>
                        </label>
                      )
                    )}
                  </div>
                </fieldset>
              </div>

              <button
                type="submit"
                className="submit-contact-btn"
                disabled={submitting}
              >
                <span>
                  {submitting
                    ? "SENDING YOUR ENQUIRY..."
                    : "SEND YOUR ENQUIRY"}
                </span>

                {!submitting && (
                  <span aria-hidden="true">↗</span>
                )}
              </button>

              <p className="contact-privacy">
                <span aria-hidden="true">◆</span>
                Your details are submitted securely through our contact
                form.
              </p>
            </form>
          </section>

          <aside className="contact-right-column">
            <section className="contact-info-block contact-details-card">
              <span className="info-eyebrow">COME SAY HELLO</span>

              <h2>Location &amp; Contact</h2>

<div className="contact-addresses-grid">
  <div className="contact-address-card">
    <span className="contact-method-icon" aria-hidden="true">
      ⌖
    </span>

    <div className="contact-address-content">
      <strong className="address-title">Main Office</strong>
      <p>
       C/SO NO 31/10034,Ramabai Ambedkar nagar  
        <br />
      Ghatkopar East, Mumbai-400075 
      </p>
    </div>
  </div>

  <div className="contact-address-card">
    <span className="contact-method-icon" aria-hidden="true">
      ⌖
    </span>

    <div className="contact-address-content">
      <strong className="address-title">Branch Office</strong>
      <p>
      Patil's API Corner, V9F9+3WM, Maya Nagar,
MIDC Industrial Area  
        <br />
        Chilkalthana,
Chhatrapati Sambhajinagar, Maharashtra 431006
      </p>
    </div>
  </div>
</div>
              <a
                className="contact-detail-item contact-method"
                href="tel:+910000000000"
              >
                <span
                  className="contact-method-icon"
                  aria-hidden="true"
                >
                  ☎
                </span>

                <span>
                  <small>Call Us</small>
                  <strong>+91 9503303333</strong>
                </span>
              </a>

              <a
                className="contact-detail-item contact-method"
                href="mailto:your-email@example.com"
              >
                <span
                  className="contact-method-icon"
                  aria-hidden="true"
                >
                  ✉
                </span>

                <span>
                  <small>Write to Us</small>
                  <strong>support@builderbroget.com</strong>
                </span>
              </a>
            </section>

<section className="contact-info-block contact-map-card">
  <div className="map-card-heading">
    <div>
      <span className="info-eyebrow">FIND YOUR WAY</span>
      <h2>Find Our Office</h2>
      <p>Visit us at our location.</p>
    </div>

    <span className="map-heading-mark" aria-hidden="true">
      ⌖
    </span>
  </div>

  <div className="contact-map">
    <iframe
      title="BuilderBroget office location on Google Maps"
      src="https://maps.google.com/maps?q=19.8727076%2C75.3697978&z=17&output=embed"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>

  <a
    className="contact-map-link"
    href="https://www.google.com/maps/place/19%C2%B052'21.8%22N+75%C2%B022'11.3%22E/@19.8727076,75.3672229,17z/data=!3m1!4b1!4m4!3m3!8m2!3d19.8727076!4d75.3697978"
    target="_blank"
    rel="noopener noreferrer"
  >
    Open in Google Maps ↗
  </a>
</section>

          </aside>

          
        </div>

        <section className="contact-bottom-section">
          <div className="office-hours-card">
            <span className="bottom-card-icon" aria-hidden="true">
              ◷
            </span>

            <div>
              <span className="info-eyebrow">PLAN YOUR VISIT</span>

              <h2>Office Hours</h2>

              <p>
                <strong>Monday – Friday</strong>
                <br />
                9:00 AM – 6:00 PM
              </p>

              <p className="office-hours-extra">
                <strong>Saturday</strong>
                <br />
                By Appointment
              </p>
            </div>
          </div>

          <section className="site-visit-card">
            <div className="site-visit-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18M8 14h3" />
              </svg>
            </div>

            <div className="site-visit-copy">
              <span className="info-eyebrow">
                LET'S MAKE A PLAN
              </span>

              <h2>Let's Meet &amp; Make It Happen</h2>

              <p>
                Have questions or a property idea? Start with a
                conversation about what matters to you.
              </p>
            </div>

            <button
              type="button"
              className="schedule-btn"
              onClick={handleSchedule}
            >
              Start a Conversation <span aria-hidden="true">↗</span>
            </button>
          </section>

          <section className="why-partner-card">
            <div className="why-partner-heading">
              <span className="info-eyebrow">
                THE BROGET DIFFERENCE
              </span>

              <h2>Why Partner With Us?</h2>
            </div>

            <div className="partner-features">
              <div className="partner-feature">
                <span className="partner-icon" aria-hidden="true">
                  ♧
                </span>

                <div>
                  <h3>Quality First</h3>
                  <p>Attention to detail</p>
                </div>
              </div>

              <div className="partner-feature">
                <span className="partner-icon" aria-hidden="true">
                  ◷
                </span>

                <div>
                  <h3>Client Focused</h3>
                  <p>Your goals matter</p>
                </div>
              </div>

              <div className="partner-feature">
                <span className="partner-icon" aria-hidden="true">
                  ◈
                </span>

                <div>
                  <h3>Transparent</h3>
                  <p>Clear communication</p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default ContactUs;