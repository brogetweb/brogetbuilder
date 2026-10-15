// import { useState } from "react";
// import axios from "axios";

// function PostProperty() {

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     propertyType: "Apartment",
//     listingType: "Buy",
//     price: "",
//     location: "",
//     city: "",
//     bedrooms: "",
//     bathrooms: "",
//     area: "",
//     furnishing: "Unfurnished",
//     ownerName: "",
//     contactNumber: ""
//   });

//   const [amenities, setAmenities] = useState([]);

//   const [images, setImages] = useState([
//     ""
//   ]);

//   const [loading, setLoading] = useState(false);

//   const [message, setMessage] = useState("");

//   const availableAmenities = [
//     "Parking",
//     "Lift",
//     "Security",
//     "Power Backup",
//     "Swimming Pool",
//     "Gym",
//     "Garden",
//     "Terrace",
//     "Club House",
//     "Road Access",
//     "Water Connection",
//     "Electricity"
//   ];


//   // =====================================
//   // INPUT CHANGE
//   // =====================================

//   const handleChange = (e) => {

//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });

//   };


//   // =====================================
//   // AMENITY
//   // =====================================

//   const handleAmenity = (amenity) => {

//     if (amenities.includes(amenity)) {

//       setAmenities(
//         amenities.filter(
//           item => item !== amenity
//         )
//       );

//     } else {

//       setAmenities([
//         ...amenities,
//         amenity
//       ]);

//     }

//   };


//   // =====================================
//   // IMAGE CHANGE
//   // =====================================

//   const handleImageChange = (index, value) => {

//     const updatedImages = [...images];

//     updatedImages[index] = value;

//     setImages(updatedImages);

//   };


//   // =====================================
//   // ADD IMAGE FIELD
//   // =====================================

//   const addImageField = () => {

//     setImages([
//       ...images,
//       ""
//     ]);

//   };


//   // =====================================
//   // REMOVE IMAGE
//   // =====================================

//   const removeImageField = (index) => {

//     const updatedImages =
//       images.filter(
//         (_, imageIndex) =>
//           imageIndex !== index
//       );

//     setImages(updatedImages);

//   };


//   // =====================================
//   // SUBMIT
//   // =====================================

//   // const handleSubmit = async (e) => {

//   //   e.preventDefault();

//   //   setLoading(true);
//   //   setMessage("");

//   //   try {

//   //     const cleanImages =
//   //       images.filter(
//   //         image => image.trim() !== ""
//   //       );

//   //     const propertyData = {

//   //       ...formData,

//   //       price: Number(formData.price),

//   //       bedrooms:
//   //         Number(formData.bedrooms) || 0,

//   //       bathrooms:
//   //         Number(formData.bathrooms) || 0,

//   //       area:
//   //         Number(formData.area),

//   //       amenities,

//   //       images: cleanImages

//   //     };

//   //     await axios.post(
//   //       "http://localhost:5000/api/properties",
//   //       propertyData
//   //     );

//   //     setMessage(
//   //       "Property posted successfully!"
//   //     );

//   //     // RESET FORM

//   //     setFormData({
//   //       title: "",
//   //       description: "",
//   //       propertyType: "Apartment",
//   //       listingType: "Buy",
//   //       price: "",
//   //       location: "",
//   //       city: "",
//   //       bedrooms: "",
//   //       bathrooms: "",
//   //       area: "",
//   //       furnishing: "Unfurnished",
//   //       ownerName: "",
//   //       contactNumber: ""
//   //     });

//   //     setAmenities([]);

//   //     setImages([""]);

//   //   } catch (error) {

//   //     console.log(error);

//   //     setMessage(
//   //       error.response?.data?.message ||
//   //       "Something went wrong"
//   //     );

//   //   } finally {

//   //     setLoading(false);

//   //   }

//   // };

// const handleSubmit = async (e) => {

//   e.preventDefault();

//   setLoading(true);
//   setMessage("");

//   try {

//     // =====================================
//     // CHECK LOGIN
//     // =====================================

//     const token = localStorage.getItem("token");
//     const savedUser = localStorage.getItem("user");

//     if (!token || !savedUser) {

//       setMessage("Please login first to post a property.");

//       setLoading(false);

//       return;
//     }

//     const user = JSON.parse(savedUser);

//     // =====================================
//     // CHECK OWNER
//     // =====================================

//     if (user.role !== "owner") {

//       setMessage(
//         "Only property owners can post a property."
//       );

//       setLoading(false);

//       return;
//     }

//     // =====================================
//     // CLEAN IMAGES
//     // =====================================

//     const cleanImages =
//       images.filter(
//         image => image.trim() !== ""
//       );

//     // =====================================
//     // PROPERTY DATA
//     // =====================================

//     const propertyData = {

//       ...formData,

//       price:
//         Number(formData.price),

//       bedrooms:
//         Number(formData.bedrooms) || 0,

//       bathrooms:
//         Number(formData.bathrooms) || 0,

//       area:
//         Number(formData.area),

//       amenities,

//       images: cleanImages

//     };

//     // =====================================
//     // POST PROPERTY
//     // =====================================

//     await axios.post(
//       "http://localhost:5000/api/properties",
//       propertyData,
//       {
//         headers: {
//           Authorization:
//             `Bearer ${token}`
//         }
//       }
//     );

//     setMessage(
//       "Property posted successfully!"
//     );

//     // =====================================
//     // RESET FORM
//     // =====================================

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
//   return (

//     <div className="post-property-page">

//       <div className="post-property-container">

//         <div className="post-header">

//           <h1>
//             Post Your Property
//           </h1>

//           <p>
//             List your property and reach
//             potential buyers or tenants.
//           </p>

//         </div>


//         {message && (
//           <div className="success-message">
//             {message}
//           </div>
//         )}


//         <form
//           className="property-form"
//           onSubmit={handleSubmit}
//         >

//           {/* BASIC INFORMATION */}

//           <div className="form-section">

//             <h2>
//               🏠 Property Information
//             </h2>

//             <div className="form-grid">

//               <div className="form-group full">

//                 <label>
//                   Property Title
//                 </label>

//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="Example: 2 BHK Apartment in CIDCO"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>


//               <div className="form-group">

//                 <label>
//                   Listing Type
//                 </label>

//                 <select
//                   name="listingType"
//                   value={formData.listingType}
//                   onChange={handleChange}
//                 >

//                   <option value="Buy">
//                     Sell
//                   </option>

//                   <option value="Rent">
//                     Rent
//                   </option>

//                   <option value="PG">
//                     PG
//                   </option>

//                 </select>

//               </div>


//               <div className="form-group">

//                 <label>
//                   Property Type
//                 </label>

//                 <select
//                   name="propertyType"
//                   value={formData.propertyType}
//                   onChange={handleChange}
//                 >

//                   <option value="Apartment">
//                     Apartment
//                   </option>

//                   <option value="Villa">
//                     Villa
//                   </option>

//                   <option value="Plot">
//                     Plot
//                   </option>

//                   <option value="Independent House">
//                     Independent House
//                   </option>

//                   <option value="Builder Floor">
//                     Builder Floor
//                   </option>

//                 </select>

//               </div>


//               <div className="form-group">

//                 <label>
//                   Price
//                 </label>

//                 <input
//                   type="number"
//                   name="price"
//                   placeholder="Enter price"
//                   value={formData.price}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>


//               <div className="form-group">

//                 <label>
//                   Area (Sq.ft)
//                 </label>

//                 <input
//                   type="number"
//                   name="area"
//                   placeholder="Example: 1200"
//                   value={formData.area}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>

//             </div>

//           </div>


//           {/* LOCATION */}

//           <div className="form-section">

//             <h2>
//               📍 Location
//             </h2>

//             <div className="form-grid">

//               <div className="form-group">

//                 <label>
//                   City
//                 </label>

//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="Example: Aurangabad"
//                   value={formData.city}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>


//               <div className="form-group">

//                 <label>
//                   Locality
//                 </label>

//                 <input
//                   type="text"
//                   name="location"
//                   placeholder="Example: CIDCO"
//                   value={formData.location}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>

//             </div>

//           </div>


//           {/* PROPERTY DETAILS */}

//           <div className="form-section">

//             <h2>
//               📐 Property Details
//             </h2>

//             <div className="form-grid">

//               <div className="form-group">

//                 <label>
//                   Bedrooms
//                 </label>

//                 <select
//                   name="bedrooms"
//                   value={formData.bedrooms}
//                   onChange={handleChange}
//                 >

//                   <option value="">
//                     Select BHK
//                   </option>

//                   <option value="1">
//                     1 BHK
//                   </option>

//                   <option value="2">
//                     2 BHK
//                   </option>

//                   <option value="3">
//                     3 BHK
//                   </option>

//                   <option value="4">
//                     4 BHK
//                   </option>

//                   <option value="5">
//                     5 BHK
//                   </option>

//                 </select>

//               </div>


//               <div className="form-group">

//                 <label>
//                   Bathrooms
//                 </label>

//                 <select
//                   name="bathrooms"
//                   value={formData.bathrooms}
//                   onChange={handleChange}
//                 >

//                   <option value="">
//                     Select
//                   </option>

//                   <option value="1">
//                     1
//                   </option>

//                   <option value="2">
//                     2
//                   </option>

//                   <option value="3">
//                     3
//                   </option>

//                   <option value="4">
//                     4
//                   </option>

//                 </select>

//               </div>


//               <div className="form-group">

//                 <label>
//                   Furnishing
//                 </label>

//                 <select
//                   name="furnishing"
//                   value={formData.furnishing}
//                   onChange={handleChange}
//                 >

//                   <option value="Furnished">
//                     Furnished
//                   </option>

//                   <option value="Semi-Furnished">
//                     Semi-Furnished
//                   </option>

//                   <option value="Unfurnished">
//                     Unfurnished
//                   </option>

//                 </select>

//               </div>

//             </div>

//           </div>


//           {/* AMENITIES */}

//           <div className="form-section">

//             <h2>
//               ⭐ Amenities
//             </h2>

//             <div className="amenities-selection">

//               {availableAmenities.map(
//                 (amenity) => (

//                   <button
//                     type="button"
//                     key={amenity}
//                     className={
//                       amenities.includes(amenity)
//                         ? "amenity-option selected"
//                         : "amenity-option"
//                     }
//                     onClick={() =>
//                       handleAmenity(amenity)
//                     }
//                   >

//                     {amenity}

//                   </button>

//                 )
//               )}

//             </div>

//           </div>


//           {/* IMAGES */}

//           <div className="form-section">

//             <h2>
//               🖼️ Property Images
//             </h2>

//             <p className="form-help">
//               Add image URLs for your property.
//             </p>

//             {images.map(
//               (image, index) => (

//                 <div
//                   className="image-input-row"
//                   key={index}
//                 >

//                   <input
//                     type="url"
//                     placeholder="https://example.com/property-image.jpg"
//                     value={image}
//                     onChange={(e) =>
//                       handleImageChange(
//                         index,
//                         e.target.value
//                       )
//                     }
//                   />

//                   {images.length > 1 && (

//                     <button
//                       type="button"
//                       className="remove-image-btn"
//                       onClick={() =>
//                         removeImageField(index)
//                       }
//                     >
//                       ✕
//                     </button>

//                   )}

//                 </div>

//               )
//             )}

//             <button
//               type="button"
//               className="add-image-btn"
//               onClick={addImageField}
//             >
//               + Add Another Image
//             </button>

//           </div>


//           {/* DESCRIPTION */}

//           <div className="form-section">

//             <h2>
//               📝 Description
//             </h2>

//             <textarea
//               name="description"
//               placeholder="Describe your property..."
//               value={formData.description}
//               onChange={handleChange}
//               rows="6"
//               required
//             />

//           </div>


//           {/* OWNER */}

//           <div className="form-section">

//             <h2>
//               👤 Owner Information
//             </h2>

//             <div className="form-grid">

//               <div className="form-group">

//                 <label>
//                   Owner Name
//                 </label>

//                 <input
//                   type="text"
//                   name="ownerName"
//                   placeholder="Full name"
//                   value={formData.ownerName}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>


//               <div className="form-group">

//                 <label>
//                   Contact Number
//                 </label>

//                 <input
//                   type="tel"
//                   name="contactNumber"
//                   placeholder="10 digit number"
//                   value={formData.contactNumber}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>

//             </div>

//           </div>


//           {/* SUBMIT */}

//           <button
//             type="submit"
//             className="submit-property-btn"
//             disabled={loading}
//           >

//             {loading
//               ? "Posting Property..."
//               : "🚀 Post Property"}

//           </button>

//         </form>

//       </div>

//     </div>

//   );
// }

// export default PostProperty;


import { useState, useEffect } from "react";
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
    contactNumber: "",
  });

  const [amenities, setAmenities] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const API_URL = "http://localhost:5000/api";

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

  // Release preview URLs when the component unmounts.
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
      setMessage("You can upload a maximum of 10 images.");
      setMessageType("error");
      e.target.value = "";
      return;
    }

    const validFiles = files.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type
        ) &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setMessage(
        "Only JPG, PNG, WEBP, or GIF images up to 5 MB each are allowed."
      );
      setMessageType("error");
    } else {
      setMessage("");
      setMessageType("");
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

    // Allow selecting the same file again later.
    e.target.value = "";
  };

  // REMOVE SELECTED IMAGE
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
        setMessage("Please login first to post a property.");
        setMessageType("error");
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch {
        setMessage("Invalid saved user information. Please login again.");
        setMessageType("error");
        return;
      }

      // CHECK OWNER ROLE
      if (user?.role !== "owner") {
        setMessage("Only property owners can post a property.");
        setMessageType("error");
        return;
      }

      // VALIDATE IMAGES
      if (selectedImages.length === 0) {
        setMessage("Please select at least one property image.");
        setMessageType("error");
        return;
      }

      // UPLOAD IMAGES TO CLOUDINARY THROUGH BACKEND
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
          throw new Error("Invalid image upload response from server.");
        }
      } finally {
        setUploadingImages(false);
      }

      // PREPARE PROPERTY DATA
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area),
        amenities,
        images: uploadedImages.map((image) => image.url),
      };

      // SAVE PROPERTY TO MONGODB THROUGH EXISTING API
      await axios.post(
        `${API_URL}/properties`,
        propertyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // SUCCESS
      setMessage("Property posted successfully!");
      setMessageType("success");

      resetForm();
    } catch (error) {
      console.error("Post property error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while posting your property."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="post-property-page">
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

        <form className="property-form" onSubmit={handleSubmit}>
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
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
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