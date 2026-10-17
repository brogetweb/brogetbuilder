
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../config";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const ContactUs = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    try {
      setSubmitting(true);

      const response = await axios.post(
        `${API_URL}/contact`,
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }
      );

      toast.success(
        `Thank you ${
          formData.name.trim() || "there"
        }! Your enquiry has been submitted successfully.`,
        {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
        }
      );

      setFormData(initialFormData);
    } catch (error) {
      console.error(
        "Contact form submission error:",
        error
      );

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

      <div className="contact-shell">
        <div className="contact-header">
          <span className="contact-badge">
            BUILDER BROGET
          </span>

          <h1>Contact Us</h1>

          <p>
            We’d love to hear about your dream property
            requirement and help you find the perfect match.
          </p>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="field-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              maxLength={100}
              autoComplete="name"
              required
              disabled={submitting}
            />
          </div>

          <div className="field-group">
            <label htmlFor="phone">
              Contact Number
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your contact number"
              inputMode="numeric"
              pattern="[0-9]{10}"
              title="Please enter a 10-digit contact number"
              autoComplete="tel"
              required
              disabled={submitting}
            />
          </div>

          <div className="field-group">
            <label htmlFor="email">Email ID</label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              maxLength={254}
              autoComplete="email"
              required
              disabled={submitting}
            />
          </div>

          <div className="field-group">
            <label htmlFor="message">Message</label>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows="5"
              maxLength={3000}
              required
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className="submit-contact-btn"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
