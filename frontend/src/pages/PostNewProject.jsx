
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialFormData = {
  name: "",
  builder: "",
  description: "",
  propertyType: "Apartment",
  location: "",
  city: "",
  configurations: "",
  minPrice: "",
  maxPrice: "",
  area: "",
  status: "New Launch",
  possession: "",
  contactName: "",
  contactNumber: "",
};

const availableAmenities = [
  "Parking",
  "Lift",
  "Security",
  "Power Backup",
  "Swimming Pool",
  "Gym",
  "Garden",
  "Terrace",
  "Club House",
  "Road Access",
  "Water Connection",
  "Electricity",
];

function PostNewProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [amenities, setAmenities] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // AMENITY SELECTION
  const handleAmenity = (amenity) => {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity]
    );
  };

  // IMAGE SELECTION
  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files || []);

    if (selectedImages.length + files.length > 10) {
      toast.error("You can upload a maximum of 10 project images.");
      e.target.value = "";
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const invalidFile = files.find(
      (file) =>
        !validTypes.includes(file.type) ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      toast.error(
        "Use JPG, PNG, WEBP, or GIF images up to 5 MB each."
      );
      e.target.value = "";
      return;
    }

    if (files.length > 0) {
      setSelectedImages((previous) => [...previous, ...files]);

      setImagePreviews((previous) => [
        ...previous,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    }

    e.target.value = "";
  };

  // REMOVE IMAGE
  const removeSelectedImage = (index) => {
    setImagePreviews((previous) => {
      URL.revokeObjectURL(previous[index]);
      return previous.filter((_, i) => i !== index);
    });

    setSelectedImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  // RESET FORM
  const resetForm = () => {
    setFormData(initialFormData);
    setAmenities([]);
    setSelectedImages([]);
    setImagePreviews([]);
  };

  // SUBMIT PROJECT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      // CHECK LOGIN
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        toast.error("Please login first to post a project.");
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch {
        toast.error("Your login session is invalid. Please login again.");
        return;
      }

      // CHECK OWNER ROLE
      if (user?.role !== "owner") {
        toast.error("Only registered owners can post a project.");
        return;
      }

      // VALIDATE PRICE RANGE
      const minPrice = Number(formData.minPrice);
      const maxPrice = Number(formData.maxPrice);

      if (
        !Number.isFinite(minPrice) ||
        !Number.isFinite(maxPrice) ||
        minPrice <= 0 ||
        maxPrice < minPrice
      ) {
        toast.error("Enter a valid minimum and maximum price.");
        return;
      }

      // VALIDATE IMAGES
      if (selectedImages.length === 0) {
        toast.error("Please select at least one project image.");
        return;
      }

      // UPLOAD IMAGES THROUGH YOUR BACKEND
      setUploadingImages(true);

      let uploadedImages;

      try {
        const imageFormData = new FormData();

        selectedImages.forEach((file) => {
          imageFormData.append("images", file);
        });

        const uploadResponse = await axios.post(
          `${API_URL}/uploads`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        uploadedImages = uploadResponse.data.images;

        if (
          !Array.isArray(uploadedImages) ||
          uploadedImages.length !== selectedImages.length ||
          uploadedImages.some(
            (image) =>
              typeof image.url !== "string" ||
              !image.url.startsWith("https://")
          )
        ) {
          throw new Error(
            "The server returned an invalid image upload response."
          );
        }
      } finally {
        setUploadingImages(false);
      }

      // PREPARE PROJECT DATA
      const projectData = {
        ...formData,
        minPrice,
        maxPrice,
        configurations: formData.configurations
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        amenities,
        images: uploadedImages.map((image) => image.url),
      };

      // SAVE PROJECT
      const response = await axios.post(
        `${API_URL}/projects`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data.message || "🎉 Project published successfully!",
        {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        }
      );

      resetForm();

      // Let the success toast appear before navigating.
      setTimeout(() => {
        navigate("/new-projects");
      }, 1200);
    } catch (error) {
      console.error("Post project error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while publishing your project.",
        {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="post-property-page">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <div className="post-property-container">
        {/* HEADER */}
        <div className="post-header">
          <h1>Post Your New Project</h1>
          <p>
            Showcase your residential project and reach potential buyers.
          </p>
        </div>

        <form className="property-form" onSubmit={handleSubmit}>
          {/* PROJECT INFORMATION */}
          <div className="form-section">
            <h2>🏗️ Project Information</h2>

            <div className="form-grid">
              <div className="form-group full">
                <label htmlFor="name">Project Name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Green Valley Residency"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="builder">Builder / Developer Name</label>
                <input
                  id="builder"
                  name="builder"
                  value={formData.builder}
                  onChange={handleChange}
                  placeholder="Builder name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="propertyType">Property Type</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                  <option value="Independent House">
                    Independent House
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Project Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="New Launch">New Launch</option>
                  <option value="Under Construction">
                    Under Construction
                  </option>
                  <option value="Ready to Move">Ready to Move</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="possession">Possession</label>
                <input
                  id="possession"
                  name="possession"
                  value={formData.possession}
                  onChange={handleChange}
                  placeholder="Example: December 2027"
                  required
                />
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="form-section">
            <h2>📍 Project Location</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Example: Aurangabad"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Locality</label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Example: CIDCO"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">Project Area</label>
                <input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Example: 2 acres / 1200 sq. ft."
                  required
                />
              </div>
            </div>
          </div>

          {/* CONFIGURATIONS AND PRICING */}
          <div className="form-section">
            <h2>💰 Configurations & Pricing</h2>

            <div className="form-grid">
              <div className="form-group full">
                <label htmlFor="configurations">
                  Available Configurations
                </label>
                <input
                  id="configurations"
                  name="configurations"
                  value={formData.configurations}
                  onChange={handleChange}
                  placeholder="Example: 1 BHK, 2 BHK, 3 BHK"
                />
                <p className="form-help">
                  Separate each configuration with a comma.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="minPrice">Minimum Price (₹)</label>
                <input
                  id="minPrice"
                  type="number"
                  name="minPrice"
                  min="1"
                  value={formData.minPrice}
                  onChange={handleChange}
                  placeholder="Example: 2500000"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxPrice">Maximum Price (₹)</label>
                <input
                  id="maxPrice"
                  type="number"
                  name="maxPrice"
                  min="1"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  placeholder="Example: 8500000"
                  required
                />
              </div>
            </div>
          </div>

          {/* AMENITIES */}
          <div className="form-section">
            <h2>⭐ Project Amenities</h2>

            <div className="amenities-selection">
              {availableAmenities.map((amenity) => (
                <button
                  type="button"
                  key={amenity}
                  className={
                    amenities.includes(amenity)
                      ? "amenity-option selected"
                      : "amenity-option"
                  }
                  onClick={() => handleAmenity(amenity)}
                  aria-pressed={amenities.includes(amenity)}
                >
                  {amenities.includes(amenity) ? "✓ " : ""}
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* PROJECT IMAGES */}
          <div className="form-section">
            <h2>🖼️ Project Images</h2>

            <p className="form-help">
              Select up to 10 project images. JPG, PNG, WEBP, or GIF;
              maximum 5 MB per image.
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageSelection}
              disabled={loading}
            />

            {imagePreviews.length > 0 && (
              <div className="property-image-preview-grid">
                {imagePreviews.map((preview, index) => (
                  <div className="property-image-preview" key={preview}>
                    <img
                      src={preview}
                      alt={`Project preview ${index + 1}`}
                    />

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeSelectedImage(index)}
                      disabled={loading}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ✕
                    </button>

                    <span className="image-number">
                      Image {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="form-help">
              {selectedImages.length} of 10 images selected
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="form-section">
            <h2>📝 Project Description</h2>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the project, its highlights, nearby facilities, and lifestyle..."
              rows={6}
              required
            />
          </div>

          {/* CONTACT INFORMATION */}
          <div className="form-section">
            <h2>👤 Builder / Contact Information</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contactName">Contact Person Name</label>
                <input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  id="contactNumber"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="10 digit number"
                  pattern="[0-9]{10}"
                  title="Enter a 10-digit phone number"
                  required
                />
              </div>
            </div>
          </div>

          {/* PUBLISH */}
          <button
            type="submit"
            className="submit-property-btn"
            disabled={loading}
          >
            {uploadingImages
              ? "☁️ Uploading Images..."
              : loading
                ? "Publishing Project..."
                : "🚀 Publish Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostNewProject;
