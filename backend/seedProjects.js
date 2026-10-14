import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Project from "./models/Project.js";

dotenv.config();

const projects = [
  {
    name: "Green Valley Residency",

    builder: "ABC Developers",

    description:
      "Green Valley Residency is a modern residential project offering spacious apartments with premium amenities and excellent connectivity.",

    location: "Beed Bypass",

    city: "Aurangabad",

    propertyType: "Apartment",

    configurations: [
      "2 BHK",
      "3 BHK"
    ],

    minPrice: 4500000,

    maxPrice: 6800000,

    area: "1050 - 1450 Sq.ft",

    status: "Under Construction",

    possession: "December 2027",

    amenities: [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Club House",
      "Security",
      "Lift"
    ],

    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000"
    ],

    featured: true,

    verified: true,

    contactName: "ABC Developers",

    contactNumber: "9876543210"
  },

  {
    name: "Skyline Heights",

    builder: "Skyline Builders",

    description:
      "Skyline Heights offers premium apartments with modern architecture, landscaped gardens and convenient access to major areas.",

    location: "Garkheda",

    city: "Aurangabad",

    propertyType: "Apartment",

    configurations: [
      "2 BHK",
      "3 BHK"
    ],

    minPrice: 5200000,

    maxPrice: 7500000,

    area: "1100 - 1600 Sq.ft",

    status: "New Launch",

    possession: "June 2028",

    amenities: [
      "Lift",
      "Security",
      "Power Backup",
      "Garden",
      "Gym",
      "Parking"
    ],

    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000"
    ],

    featured: true,

    verified: true,

    contactName: "Skyline Builders",

    contactNumber: "9823456789"
  },

  {
    name: "Royal Palm Villas",

    builder: "Royal Homes",

    description:
      "Royal Palm Villas is a premium villa project offering spacious homes with private gardens, parking and modern facilities.",

    location: "Waluj",

    city: "Aurangabad",

    propertyType: "Villa",

    configurations: [
      "3 BHK",
      "4 BHK"
    ],

    minPrice: 8500000,

    maxPrice: 12500000,

    area: "2200 - 3000 Sq.ft",

    status: "Under Construction",

    possession: "March 2028",

    amenities: [
      "Garden",
      "Parking",
      "Terrace",
      "Security",
      "Club House"
    ],

    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1000",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000"
    ],

    featured: true,

    verified: true,

    contactName: "Royal Homes",

    contactNumber: "9898989898"
  },

  {
    name: "Urban Nest",

    builder: "Urban Developers",

    description:
      "Urban Nest offers affordable apartments with essential amenities in a well-connected residential locality.",

    location: "CIDCO",

    city: "Aurangabad",

    propertyType: "Apartment",

    configurations: [
      "1 BHK",
      "2 BHK",
      "3 BHK"
    ],

    minPrice: 3200000,

    maxPrice: 6500000,

    area: "650 - 1450 Sq.ft",

    status: "Ready to Move",

    possession: "Ready",

    amenities: [
      "Parking",
      "Lift",
      "Security",
      "Gym",
      "Garden"
    ],

    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000"
    ],

    featured: false,

    verified: true,

    contactName: "Urban Developers",

    contactNumber: "9765432109"
  },

  {
    name: "The Grand Residency",

    builder: "Grand Infra",

    description:
      "The Grand Residency is a premium apartment project with modern amenities and spacious homes.",

    location: "Jalna Road",

    city: "Aurangabad",

    propertyType: "Apartment",

    configurations: [
      "2 BHK",
      "3 BHK"
    ],

    minPrice: 4800000,

    maxPrice: 7200000,

    area: "1050 - 1550 Sq.ft",

    status: "New Launch",

    possession: "September 2028",

    amenities: [
      "Club House",
      "Swimming Pool",
      "Gym",
      "Parking",
      "Security"
    ],

    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000"
    ],

    featured: false,

    verified: true,

    contactName: "Grand Infra",

    contactNumber: "9012345678"
  },

  {
    name: "Palm Grove",

    builder: "Dream Homes",

    description:
      "Palm Grove offers spacious apartments with landscaped surroundings and modern lifestyle amenities.",

    location: "Chikalthana",

    city: "Aurangabad",

    propertyType: "Apartment",

    configurations: [
      "2 BHK",
      "3 BHK"
    ],

    minPrice: 4200000,

    maxPrice: 6200000,

    area: "1000 - 1500 Sq.ft",

    status: "Under Construction",

    possession: "January 2028",

    amenities: [
      "Garden",
      "Parking",
      "Power Backup",
      "Security",
      "Lift"
    ],

    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000"
    ],

    featured: false,

    verified: true,

    contactName: "Dream Homes",

    contactNumber: "9090909090"
  }
];

const seedProjects = async () => {
  try {
    await connectDB();

    console.log(
      "Connected to MongoDB"
    );

    await Project.deleteMany();

    console.log(
      "Old projects removed"
    );

    await Project.insertMany(
      projects
    );

    console.log(
      `${projects.length} projects added successfully!`
    );

    process.exit(0);

  } catch (error) {
    console.log(
      "Error while inserting projects:"
    );

    console.log(error.message);

    process.exit(1);
  }
};

seedProjects();