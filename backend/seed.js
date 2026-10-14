// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import Property from "./models/Property.js";

// dotenv.config();

// const properties = [
//   {
//     title: "2 BHK Apartment in CIDCO",
//     description:
//       "Beautiful 2 BHK apartment with spacious rooms, parking and modern amenities.",
//     propertyType: "Apartment",
//     listingType: "Buy",
//     price: 4500000,
//     location: "CIDCO",
//     city: "Aurangabad",
//     bedrooms: 2,
//     bathrooms: 2,
//     area: 1050,
//     furnishing: "Semi-Furnished",
//     images: [
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000"
//     ],
//     ownerName: "Rahul Patil",
//     contactNumber: "9876543210"
//   },

//   {
//     title: "3 BHK Luxury Apartment",
//     description:
//       "Spacious 3 BHK apartment located in a prime residential area.",
//     propertyType: "Apartment",
//     listingType: "Buy",
//     price: 6800000,
//     location: "Garkheda",
//     city: "Aurangabad",
//     bedrooms: 3,
//     bathrooms: 2,
//     area: 1450,
//     furnishing: "Furnished",
//     images: [
//       "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000"
//     ],
//     ownerName: "Amit Deshmukh",
//     contactNumber: "9823456789"
//   },

//   {
//     title: "2 BHK Flat for Rent",
//     description:
//       "Well-maintained 2 BHK flat available for rent with parking.",
//     propertyType: "Apartment",
//     listingType: "Rent",
//     price: 18000,
//     location: "Beed Bypass",
//     city: "Aurangabad",
//     bedrooms: 2,
//     bathrooms: 2,
//     area: 1100,
//     furnishing: "Furnished",
//     images: [
//       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000"
//     ],
//     ownerName: "Sneha Kulkarni",
//     contactNumber: "9765432109"
//   },

//   {
//     title: "Beautiful 4 BHK Villa",
//     description:
//       "Independent villa with garden, parking and spacious living area.",
//     propertyType: "Villa",
//     listingType: "Buy",
//     price: 12500000,
//     location: "Waluj",
//     city: "Aurangabad",
//     bedrooms: 4,
//     bathrooms: 3,
//     area: 2800,
//     furnishing: "Semi-Furnished",
//     images: [
//       "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1000"
//     ],
//     ownerName: "Vikas Joshi",
//     contactNumber: "9898989898"
//   },

//   {
//     title: "Residential Plot",
//     description:
//       "Residential plot available in a developing locality.",
//     propertyType: "Plot",
//     listingType: "Buy",
//     price: 3200000,
//     location: "Chikalthana",
//     city: "Aurangabad",
//     bedrooms: 0,
//     bathrooms: 0,
//     area: 1800,
//     furnishing: "Unfurnished",
//     images: [
//       "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000"
//     ],
//     ownerName: "Sanjay Shinde",
//     contactNumber: "9012345678"
//   },

//   {
//     title: "3 BHK Independent House",
//     description:
//       "Spacious independent house suitable for a family.",
//     propertyType: "Independent House",
//     listingType: "Rent",
//     price: 28000,
//     location: "Satara Parisar",
//     city: "Aurangabad",
//     bedrooms: 3,
//     bathrooms: 3,
//     area: 1900,
//     furnishing: "Semi-Furnished",
//     images: [
//       "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1000"
//     ],
//     ownerName: "Prasad More",
//     contactNumber: "9123456780"
//   },

//   {
//     title: "1 BHK Apartment",
//     description:
//       "Affordable 1 BHK apartment suitable for students and working professionals.",
//     propertyType: "Apartment",
//     listingType: "Rent",
//     price: 10000,
//     location: "Shahnoorwadi",
//     city: "Aurangabad",
//     bedrooms: 1,
//     bathrooms: 1,
//     area: 650,
//     furnishing: "Furnished",
//     images: [
//       "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000"
//     ],
//     ownerName: "Neha Pawar",
//     contactNumber: "9345678901"
//   }
// ];

// const seedDatabase = async () => {
//   try {
//     await connectDB();

//     await Property.deleteMany();

//     await Property.insertMany(properties);

//     console.log("Properties added successfully!");

//     process.exit();
//   } catch (error) {
//     console.log(error.message);

//     process.exit(1);
//   }
// };

// seedDatabase();

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Property from "./models/Property.js";

dotenv.config();

const properties = [
  {
    title: "2 BHK Apartment in CIDCO",

    description:
      "Beautiful 2 BHK apartment with spacious rooms, parking and modern amenities.",

    propertyType: "Apartment",

    listingType: "Buy",

    price: 4500000,

    location: "CIDCO",

    city: "Aurangabad",

    bedrooms: 2,

    bathrooms: 2,

    area: 1050,

    furnishing: "Semi-Furnished",

    amenities: [
      "Parking",
      "Lift",
      "Security",
      "Power Backup"
    ],

    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000"
    ],

    ownerName: "Rahul Patil",

    contactNumber: "9876543210",

    featured: true
  },


  {
    title: "3 BHK Luxury Apartment",

    description:
      "Spacious 3 BHK apartment located in a prime residential area with modern facilities.",

    propertyType: "Apartment",

    listingType: "Buy",

    price: 6800000,

    location: "Garkheda",

    city: "Aurangabad",

    bedrooms: 3,

    bathrooms: 2,

    area: 1450,

    furnishing: "Furnished",

    amenities: [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Lift",
      "Security"
    ],

    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000"
    ],

    ownerName: "Amit Deshmukh",

    contactNumber: "9823456789",

    featured: true
  },


  {
    title: "2 BHK Flat for Rent",

    description:
      "Well-maintained 2 BHK flat available for rent with parking and security.",

    propertyType: "Apartment",

    listingType: "Rent",

    price: 18000,

    location: "Beed Bypass",

    city: "Aurangabad",

    bedrooms: 2,

    bathrooms: 2,

    area: 1100,

    furnishing: "Furnished",

    amenities: [
      "Parking",
      "Lift",
      "Security",
      "Power Backup"
    ],

    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000"
    ],

    ownerName: "Sneha Kulkarni",

    contactNumber: "9765432109",

    featured: true
  },


  {
    title: "Beautiful 4 BHK Villa",

    description:
      "Independent luxury villa with garden, parking and spacious living area.",

    propertyType: "Villa",

    listingType: "Buy",

    price: 12500000,

    location: "Waluj",

    city: "Aurangabad",

    bedrooms: 4,

    bathrooms: 3,

    area: 2800,

    furnishing: "Semi-Furnished",

    amenities: [
      "Garden",
      "Parking",
      "Security",
      "Terrace",
      "Power Backup"
    ],

    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1000"
    ],

    ownerName: "Vikas Joshi",

    contactNumber: "9898989898",

    featured: true
  },


  {
    title: "Residential Plot in Chikalthana",

    description:
      "Residential plot available in a developing locality suitable for building a house.",

    propertyType: "Plot",

    listingType: "Buy",

    price: 3200000,

    location: "Chikalthana",

    city: "Aurangabad",

    bedrooms: 0,

    bathrooms: 0,

    area: 1800,

    furnishing: "Unfurnished",

    amenities: [
      "Road Access",
      "Water Connection",
      "Electricity"
    ],

    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000"
    ],

    ownerName: "Sanjay Shinde",

    contactNumber: "9012345678",

    featured: false
  },


  {
    title: "3 BHK Independent House",

    description:
      "Spacious independent house suitable for a family with parking and a peaceful environment.",

    propertyType: "Independent House",

    listingType: "Rent",

    price: 28000,

    location: "Satara Parisar",

    city: "Aurangabad",

    bedrooms: 3,

    bathrooms: 3,

    area: 1900,

    furnishing: "Semi-Furnished",

    amenities: [
      "Parking",
      "Garden",
      "Security",
      "Terrace"
    ],

    images: [
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1000"
    ],

    ownerName: "Prasad More",

    contactNumber: "9123456780",

    featured: false
  },


  {
    title: "1 BHK Apartment",

    description:
      "Affordable 1 BHK apartment suitable for students and working professionals.",

    propertyType: "Apartment",

    listingType: "Rent",

    price: 10000,

    location: "Shahnoorwadi",

    city: "Aurangabad",

    bedrooms: 1,

    bathrooms: 1,

    area: 650,

    furnishing: "Furnished",

    amenities: [
      "Parking",
      "Lift",
      "Security"
    ],

    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000"
    ],

    ownerName: "Neha Pawar",

    contactNumber: "9345678901",

    featured: false
  },


  {
    title: "3 BHK Builder Floor",

    description:
      "Modern 3 BHK builder floor with spacious rooms and excellent connectivity.",

    propertyType: "Builder Floor",

    listingType: "Buy",

    price: 7200000,

    location: "Jalna Road",

    city: "Aurangabad",

    bedrooms: 3,

    bathrooms: 2,

    area: 1550,

    furnishing: "Semi-Furnished",

    amenities: [
      "Parking",
      "Lift",
      "Security",
      "Power Backup"
    ],

    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000"
    ],

    ownerName: "Rohit Kulkarni",

    contactNumber: "9876501234",

    featured: true
  },


  {
    title: "2 BHK Apartment in Beed Bypass",

    description:
      "Modern 2 BHK apartment with good connectivity and essential amenities.",

    propertyType: "Apartment",

    listingType: "Buy",

    price: 5200000,

    location: "Beed Bypass",

    city: "Aurangabad",

    bedrooms: 2,

    bathrooms: 2,

    area: 1150,

    furnishing: "Semi-Furnished",

    amenities: [
      "Parking",
      "Lift",
      "Security",
      "Club House"
    ],

    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000"
    ],

    ownerName: "Pooja More",

    contactNumber: "9988776655",

    featured: false
  },


  {
    title: "Luxury 4 BHK Independent House",

    description:
      "Large independent house with spacious bedrooms, garden and dedicated parking.",

    propertyType: "Independent House",

    listingType: "Buy",

    price: 9500000,

    location: "N-5 CIDCO",

    city: "Aurangabad",

    bedrooms: 4,

    bathrooms: 3,

    area: 2500,

    furnishing: "Furnished",

    amenities: [
      "Garden",
      "Parking",
      "Terrace",
      "Security",
      "Power Backup"
    ],

    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000"
    ],

    ownerName: "Akshay Patil",

    contactNumber: "9090909090",

    featured: true
  }
];


// ======================================
// INSERT DATA INTO MONGODB
// ======================================

const seedDatabase = async () => {

  try {

    // Connect to MongoDB
    await connectDB();

    console.log("Connected to MongoDB");


    // Remove existing properties
    await Property.deleteMany();

    console.log(
      "Old properties removed"
    );


    // Insert new properties
    await Property.insertMany(
      properties
    );

    console.log(
      `${properties.length} properties added successfully!`
    );


    process.exit(0);

  } catch (error) {

    console.log(
      "Error while inserting properties:"
    );

    console.log(
      error.message
    );

    process.exit(1);

  }

};


seedDatabase();