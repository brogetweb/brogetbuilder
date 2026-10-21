import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PostProperty() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "Apartment",
    listingType: "Buy",
    price: "",
    location: "",
    city: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    furnishing: "Unfurnished",
    facing: "",
    balconies: "0",
    floor: "",
    totalFloors: "",
    ownerName: "",
    contactNumber: "",
  });

  const [amenities, setAmenities] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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

  const facingOptions = [
    "North",
    "South",
    "East",
    "West",
    "North-East",
    "North-West",
    "South-East",
    "South-West",
  ];

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      // Floor details are only applicable to Apartments.
      if (
        name === "propertyType" &&
        value !== "Apartment"
      ) {
        updated.floor = "";
        updated.totalFloors = "";
      }

      return updated;
    });
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
      toast.error("You can upload a maximum of 10 images.");
      e.target.value = "";
      return;
    }

    const validFiles = files.filter(
      (file) =>
        [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ].includes(file.type) &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error(
        "Only JPG, PNG, WEBP, or GIF images up to 5 MB each are allowed."
      );
    }

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setSelectedImages((previous) => [
        ...previous,
        ...validFiles,
      ]);

      setImagePreviews((previous) => [
        ...previous,
        ...newPreviews,
      ]);
    }

    e.target.value = "";
  };

  // REMOVE SELECTED IMAGE
  const removeSelectedImage = (index) => {
    setImagePreviews((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setSelectedImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      propertyType: "Apartment",
      listingType: "Buy",
      price: "",
      location: "",
      city: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      furnishing: "Unfurnished",
      facing: "",
      balconies: "0",
      floor: "",
      totalFloors: "",
      ownerName: "",
      contactNumber: "",
    });

    setAmenities([]);
    setSelectedImages([]);
    setImagePreviews([]);
  };

  // SUBMIT PROPERTY
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      // CHECK LOGIN
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        toast.error("Please login first to post a property.");
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch {
        toast.error(
          "Invalid saved user information. Please login again."
        );
        return;
      }

      // CHECK OWNER ROLE
      if (user?.role !== "owner") {
        toast.error("Only property owners can post a property.");
        return;
      }

      // VALIDATE IMAGES
      if (selectedImages.length === 0) {
        toast.error("Please select at least one property image.");
        return;
      }

      // VALIDATE APARTMENT FLOOR DETAILS
      if (formData.propertyType === "Apartment") {
        if (
          formData.floor === "" ||
          formData.totalFloors === ""
        ) {
          toast.error(
            "Please enter the floor number and total floors for the apartment."
          );
          return;
        }

        const floor = Number(formData.floor);
        const totalFloors = Number(formData.totalFloors);

        if (
          floor < 0 ||
          totalFloors < 1 ||
          floor > totalFloors
        ) {
          toast.error(
            "Please enter a valid floor number and total floors."
          );
          return;
        }
      }

      // UPLOAD IMAGES
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
            "Invalid image upload response from server."
          );
        }
      } finally {
        setUploadingImages(false);
      }

      // PREPARE PROPERTY DATA
      const isApartment =
        formData.propertyType === "Apartment";

      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area),

        // NEW FIELDS
        facing: formData.facing,
        balconies: Number(formData.balconies) || 0,
        floor: isApartment ? Number(formData.floor) : null,
        totalFloors: isApartment
          ? Number(formData.totalFloors)
          : null,

        amenities,
        images: uploadedImages.map((image) => image.url),
      };

      // SAVE PROPERTY
      const response = await axios.post(
        `${API_URL}/properties`,
        propertyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Property created:", response.data);

      toast.success("🎉 Property posted successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      resetForm();
    } catch (error) {
      console.error("Post property error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while posting your property.",
        {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        }
      );

      setMessageType("error");
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
        <div className="post-header">
          <h1>Post Your Property</h1>
          <p>
            List your property and reach potential buyers or tenants.
          </p>
        </div>

        {message && (
          <div
            className={`success-message ${
              messageType === "error" ? "error-message" : ""
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form
          className="property-form"
          onSubmit={handleSubmit}
        >
          {/* PROPERTY INFORMATION */}
          <div className="form-section">
            <h2>🏠 Property Information</h2>

            <div className="form-grid">
              <div className="form-group full">
                <label htmlFor="title">Property Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Example: 2 BHK Apartment in CIDCO"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="listingType">Listing Type</label>
                <select
                  id="listingType"
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  required
                >
                  <option value="Buy">Sell</option>
                  <option value="Rent">Rent</option>
                  <option value="PG">PG</option>
                </select>
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
                  <option value="Builder Floor">Builder Floor</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">Area (Sq. ft)</label>
                <input
                  id="area"
                  type="number"
                  name="area"
                  placeholder="Example: 1200"
                  min="1"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="form-section">
            <h2>📍 Location</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Example: Aurangabad"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Locality</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="Example: CIDCO"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* PROPERTY DETAILS */}
          <div className="form-section">
            <h2>📐 Property Details</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                >
                  <option value="">Select BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5 BHK</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <select
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="furnishing">Furnishing</label>
                <select
                  id="furnishing"
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">
                    Semi-Furnished
                  </option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              {/* NEW: FACING */}
              <div className="form-group">
                <label htmlFor="facing">Facing Direction</label>
                <select
                  id="facing"
                  name="facing"
                  value={formData.facing}
                  onChange={handleChange}
                >
                  <option value="">Select facing</option>
                  {facingOptions.map((direction) => (
                    <option key={direction} value={direction}>
                      {direction}
                    </option>
                  ))}
                </select>
              </div>

              {/* NEW: BALCONIES */}
              <div className="form-group">
                <label htmlFor="balconies">Number of Balconies</label>
                <select
                  id="balconies"
                  name="balconies"
                  value={formData.balconies}
                  onChange={handleChange}
                >
                  <option value="0">0 Balconies</option>
                  <option value="1">1 Balcony</option>
                  <option value="2">2 Balconies</option>
                  <option value="3">3 Balconies</option>
                  <option value="4">4 Balconies</option>
                  <option value="5">5 Balconies</option>
                </select>
              </div>

              {/* APARTMENT-ONLY FIELDS */}
              {formData.propertyType === "Apartment" && (
                <>
                  <div className="form-group">
                    <label htmlFor="floor">Floor Number</label>
                    <input
                      id="floor"
                      type="number"
                      name="floor"
                      placeholder="Example: 3"
                      min="0"
                      value={formData.floor}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="totalFloors">
                      Total Floors in Building
                    </label>
                    <input
                      id="totalFloors"
                      type="number"
                      name="totalFloors"
                      placeholder="Example: 10"
                      min="1"
                      value={formData.totalFloors}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* AMENITIES */}
          <div className="form-section">
            <h2>⭐ Amenities</h2>

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

          {/* CLOUDINARY IMAGE UPLOAD */}
          <div className="form-section">
            <h2>🖼️ Property Images</h2>

            <p className="form-help">
              Select up to 10 property images. JPG, PNG, WEBP, or GIF.
              Maximum 5 MB per image.
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
                  <div
                    className="property-image-preview"
                    key={preview}
                  >
                    <img
                      src={preview}
                      alt={`Property preview ${index + 1}`}
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
            <h2>📝 Description</h2>

            <textarea
              name="description"
              placeholder="Describe your property..."
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          {/* OWNER INFORMATION */}
          <div className="form-section">
            <h2>👤 Owner Information</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="ownerName">Owner Name</label>
                <input
                  id="ownerName"
                  type="text"
                  name="ownerName"
                  placeholder="Full name"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  id="contactNumber"
                  type="tel"
                  name="contactNumber"
                  placeholder="10 digit number"
                  pattern="[0-9]{10}"
                  title="Enter a 10-digit phone number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="submit-property-btn"
            disabled={loading}
          >
            {uploadingImages
              ? "☁️ Uploading Images..."
              : loading
                ? "Posting Property..."
                : "🚀 Post Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostProperty;
