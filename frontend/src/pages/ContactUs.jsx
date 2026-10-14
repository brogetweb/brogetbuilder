import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      `Thank you ${formData.name || "there"}! Our team will contact you shortly.`
    );

    setFormData({
      name: "",
      phone: "",
      email: "",
      message: ""
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-shell">
        <div className="contact-header">
          <span className="contact-badge">HOME ESTATE</span>
          <h1>Contact Us</h1>
          <p>
            We’d love to hear about your dream property requirement and help you find
            the perfect match.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="phone">Contact Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your contact number"
              inputMode="numeric"
              required
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
              required
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
              required
            />
          </div>

          <button type="submit" className="submit-contact-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
