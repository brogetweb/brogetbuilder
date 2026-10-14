// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import connectDB from "./config/db.js";

// // import propertyRoutes
// //   from "./routes/propertyRoutes.js";
// import PropertyRoutes from "./routes/PropertyRoutes.js"

// dotenv.config();


// // CREATE EXPRESS APP

// const app = express();


// // MIDDLEWARE

// app.use(cors());

// app.use(express.json());


// // CONNECT DATABASE

// connectDB();


// // PROPERTY ROUTES

// app.use(
//   "/api/properties",
//   PropertyRoutes
// );


// // TEST ROUTE

// app.get("/", (req, res) => {

//   res.send(
//     "Real Estate API is running"
//   );

// });


// // SERVER

// const PORT =
//   process.env.PORT || 5000;


// app.listen(PORT, () => {

//   console.log(
//     `Server running on port ${PORT}`
//   );

// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import PropertyRoutes from "./routes/PropertyRoutes.js"
import enquiryRoutes from "./routes/enquiryRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";

import loanRoutes from "./routes/loanRoutes.js";

import aiCallRoutes from "./routes/aiCallRoutes.js";

import publicOwnerRoutes from "./routes/publicOwnerRoutes.js";


import uploadRoutes from "./routes/uploadRoutes.js";

import superAdminRoutes from "./routes/superAdminRoutes.js";

import authMiddleware from "./middleware/authMiddleware.js";
import requireApprovedOwner from "./middleware/requireApprovedOwner.js";


import testimonialRoutes from "./routes/testimonialRoutes.js";
dotenv.config();

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// ROUTES
// ==========================================
app.use("/api/auth", authRoutes);

app.use(
  "/api/properties",
  PropertyRoutes
);

app.use(
  "/api/enquiries",
  enquiryRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.use("/api/favourites", favouriteRoutes);

app.use("/api/visits", visitRoutes);
// app.use("/api/owner", ownerRoutes);
app.use(
  "/api/owner",
  authMiddleware,
  requireApprovedOwner,
  ownerRoutes
);

app.use("/api/admin", superAdminRoutes)
app.use("/api/loans", loanRoutes);


app.use("/api/ai-calls", aiCallRoutes);

// app.use("/api/owners", publicOwnerRoutes);
app.use("/api/public/owners", publicOwnerRoutes);



app.use("/api/uploads", uploadRoutes);


app.use("/api/testimonials", testimonialRoutes);
// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

  res.send(
    "Real Estate API is running"
  );

});


// ==========================================
// SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});