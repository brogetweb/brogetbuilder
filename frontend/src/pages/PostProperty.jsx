import { useState } from "react";
import axios from "axios";

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
    ownerName: "",
    contactNumber: ""
  });

  const [amenities, setAmenities] = useState([]);

  const [images, setImages] = useState([
    ""
  ]);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

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
    "Electricity"
  ];


  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // =====================================
  // AMENITY
  // =====================================

  const handleAmenity = (amenity) => {

    if (amenities.includes(amenity)) {

      setAmenities(
        amenities.filter(
          item => item !== amenity
        )
      );

    } else {

      setAmenities([
        ...amenities,
        amenity
      ]);

    }

  };


  // =====================================
  // IMAGE CHANGE
  // =====================================

  const handleImageChange = (index, value) => {

    const updatedImages = [...images];

    updatedImages[index] = value;

    setImages(updatedImages);

  };


  // =====================================
  // ADD IMAGE FIELD
  // =====================================

  const addImageField = () => {

    setImages([
      ...images,
      ""
    ]);

  };


  // =====================================
  // REMOVE IMAGE
  // =====================================

  const removeImageField = (index) => {

    const updatedImages =
      images.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

    setImages(updatedImages);

  };


  // =====================================
  // SUBMIT
  // =====================================

  // const handleSubmit = async (e) => {

  //   e.preventDefault();

  //   setLoading(true);
  //   setMessage("");

  //   try {

  //     const cleanImages =
  //       images.filter(
  //         image => image.trim() !== ""
  //       );

  //     const propertyData = {

  //       ...formData,

  //       price: Number(formData.price),

  //       bedrooms:
  //         Number(formData.bedrooms) || 0,

  //       bathrooms:
  //         Number(formData.bathrooms) || 0,

  //       area:
  //         Number(formData.area),

  //       amenities,

  //       images: cleanImages

  //     };

  //     await axios.post(
  //       "http://localhost:5000/api/properties",
  //       propertyData
  //     );

  //     setMessage(
  //       "Property posted successfully!"
  //     );

  //     // RESET FORM

  //     setFormData({
  //       title: "",
  //       description: "",
  //       propertyType: "Apartment",
  //       listingType: "Buy",
  //       price: "",
  //       location: "",
  //       city: "",
  //       bedrooms: "",
  //       bathrooms: "",
  //       area: "",
  //       furnishing: "Unfurnished",
  //       ownerName: "",
  //       contactNumber: ""
  //     });

  //     setAmenities([]);

  //     setImages([""]);

  //   } catch (error) {

  //     console.log(error);

  //     setMessage(
  //       error.response?.data?.message ||
  //       "Something went wrong"
  //     );

  //   } finally {

  //     setLoading(false);

  //   }

  // };

const handleSubmit = async (e) => {

  e.preventDefault();

  setLoading(true);
  setMessage("");

  try {

    // =====================================
    // CHECK LOGIN
    // =====================================

    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {

      setMessage("Please login first to post a property.");

      setLoading(false);

      return;
    }

    const user = JSON.parse(savedUser);

    // =====================================
    // CHECK OWNER
    // =====================================

    if (user.role !== "owner") {

      setMessage(
        "Only property owners can post a property."
      );

      setLoading(false);

      return;
    }

    // =====================================
    // CLEAN IMAGES
    // =====================================

    const cleanImages =
      images.filter(
        image => image.trim() !== ""
      );

    // =====================================
    // PROPERTY DATA
    // =====================================

    const propertyData = {

      ...formData,

      price:
        Number(formData.price),

      bedrooms:
        Number(formData.bedrooms) || 0,

      bathrooms:
        Number(formData.bathrooms) || 0,

      area:
        Number(formData.area),

      amenities,

      images: cleanImages

    };

    if (token === "demo-owner-token") {
      const savedProperties = JSON.parse(
        localStorage.getItem("demoOwnerProperties") || "[]"
      );
      const demoProperty = {
        ...propertyData,
        _id: `demo-property-${Date.now()}`,
        ownerId: "demo-owner",
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(
        "demoOwnerProperties",
        JSON.stringify([...savedProperties, demoProperty])
      );
      setMessage(
        "Demo property saved in this browser only. MongoDB is not connected."
      );
      setLoading(false);
      return;
    }

    // =====================================
    // POST PROPERTY
    // =====================================

    await axios.post(
      "http://localhost:5000/api/properties",
      propertyData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    setMessage(
      "Property posted successfully!"
    );

    // =====================================
    // RESET FORM
    // =====================================

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
      ownerName: "",
      contactNumber: ""

    });

    setAmenities([]);

    setImages([""]);

  } catch (error) {

    console.log(error);

    setMessage(
      error.response?.data?.message ||
      "Something went wrong"
    );

  } finally {

    setLoading(false);

  }

};
  return (

    <div className="post-property-page">

      <div className="post-property-container">

        <div className="post-header">

          <h1>
            Post Your Property
          </h1>

          <p>
            List your property and reach
            potential buyers or tenants.
          </p>

        </div>


        {message && (
          <div className="success-message">
            {message}
          </div>
        )}


        <form
          className="property-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <div className="form-section">

            <h2>
              🏠 Property Information
            </h2>

            <div className="form-grid">

              <div className="form-group full">

                <label>
                  Property Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Example: 2 BHK Apartment in CIDCO"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Listing Type
                </label>

                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                >

                  <option value="Buy">
                    Sell
                  </option>

                  <option value="Rent">
                    Rent
                  </option>

                  <option value="PG">
                    PG
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Property Type
                </label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >

                  <option value="Apartment">
                    Apartment
                  </option>

                  <option value="Villa">
                    Villa
                  </option>

                  <option value="Plot">
                    Plot
                  </option>

                  <option value="Independent House">
                    Independent House
                  </option>

                  <option value="Builder Floor">
                    Builder Floor
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Area (Sq.ft)
                </label>

                <input
                  type="number"
                  name="area"
                  placeholder="Example: 1200"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>


          {/* LOCATION */}

          <div className="form-section">

            <h2>
              📍 Location
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  placeholder="Example: Aurangabad"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Locality
                </label>

                <input
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

            <h2>
              📐 Property Details
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Bedrooms
                </label>

                <select
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                >

                  <option value="">
                    Select BHK
                  </option>

                  <option value="1">
                    1 BHK
                  </option>

                  <option value="2">
                    2 BHK
                  </option>

                  <option value="3">
                    3 BHK
                  </option>

                  <option value="4">
                    4 BHK
                  </option>

                  <option value="5">
                    5 BHK
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Bathrooms
                </label>

                <select
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                >

                  <option value="">
                    Select
                  </option>

                  <option value="1">
                    1
                  </option>

                  <option value="2">
                    2
                  </option>

                  <option value="3">
                    3
                  </option>

                  <option value="4">
                    4
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Furnishing
                </label>

                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                >

                  <option value="Furnished">
                    Furnished
                  </option>

                  <option value="Semi-Furnished">
                    Semi-Furnished
                  </option>

                  <option value="Unfurnished">
                    Unfurnished
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* AMENITIES */}

          <div className="form-section">

            <h2>
              ⭐ Amenities
            </h2>

            <div className="amenities-selection">

              {availableAmenities.map(
                (amenity) => (

                  <button
                    type="button"
                    key={amenity}
                    className={
                      amenities.includes(amenity)
                        ? "amenity-option selected"
                        : "amenity-option"
                    }
                    onClick={() =>
                      handleAmenity(amenity)
                    }
                  >

                    {amenity}

                  </button>

                )
              )}

            </div>

          </div>


          {/* IMAGES */}

          <div className="form-section">

            <h2>
              🖼️ Property Images
            </h2>

            <p className="form-help">
              Add image URLs for your property.
            </p>

            {images.map(
              (image, index) => (

                <div
                  className="image-input-row"
                  key={index}
                >

                  <input
                    type="url"
                    placeholder="https://example.com/property-image.jpg"
                    value={image}
                    onChange={(e) =>
                      handleImageChange(
                        index,
                        e.target.value
                      )
                    }
                  />

                  {images.length > 1 && (

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() =>
                        removeImageField(index)
                      }
                    >
                      ✕
                    </button>

                  )}

                </div>

              )
            )}

            <button
              type="button"
              className="add-image-btn"
              onClick={addImageField}
            >
              + Add Another Image
            </button>

          </div>


          {/* DESCRIPTION */}

          <div className="form-section">

            <h2>
              📝 Description
            </h2>

            <textarea
              name="description"
              placeholder="Describe your property..."
              value={formData.description}
              onChange={handleChange}
              rows="6"
              required
            />

          </div>


          {/* OWNER */}

          <div className="form-section">

            <h2>
              👤 Owner Information
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Owner Name
                </label>

                <input
                  type="text"
                  name="ownerName"
                  placeholder="Full name"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Contact Number
                </label>

                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="10 digit number"
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

            {loading
              ? "Posting Property..."
              : "🚀 Post Property"}

          </button>

        </form>

      </div>

    </div>

  );
}

export default PostProperty;