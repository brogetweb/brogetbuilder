import {
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import WhyChooseUs from "./pages/WhyChooseUs";
import PropertyDetails from "./pages/PropertyDetails";
import PostProperty from "./pages/PostProperty";
import Favourites from "./pages/Favourites";
import NewProjects from "./pages/NewProjects";
import ProjectDetails from "./pages/ProjectDetails";

import Apartments from "./pages/Apartments";
import Villas from "./pages/Villas";
import Plots from "./pages/Plots";
import IndependentHouses from "./pages/IndependentHouses";
import BuilderFloors from "./pages/BuilderFloors";
import OwnerDashboard from "./pages/OwnerDashboard";

import OwnerProperties from "./pages/OwnerProperties";
import ContactUs from "./pages/ContactUs";

import SuperAdminPanel from "./pages/SuperAdminPanel";
import OwnerApplicationStatus from "./pages/OwnerApplicationStatus";
import PropertyNews from "./pages/PropertyNews";
import PropertyNewsDetails from "./pages/PropertyNewsDetails";
import AdminTestimonials from "./pages/AdminTestimonials";
import PostNewProject from "./pages/PostNewProject";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home listingType="" />}
        />

        <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

        {/* BUY / RENT / PG */}
        <Route
          path="/buy"
          element={<Home listingType="Buy" />}
        />

        <Route
          path="/rent"
          element={<Home listingType="Rent" />}
        />

        <Route
          path="/pg"
          element={<Home listingType="PG" />}
        />

         <Route
          path="/about-us"
          element={<AboutUs />}
        />

 <Route
          path="/contact-us"
          element={<ContactUs />}
        />

        <Route
          path="/property-news"
          element={<PropertyNews />}
        />

        <Route
  path="/property-news/:slug"
  element={<PropertyNewsDetails />}
/>

        <Route
  path="/owner-dashboard"
  element={<OwnerDashboard />}
/>

<Route
  path="/super-admin"
  element={<SuperAdminPanel />}
/>

<Route
  path="/owner-application-status"
  element={<OwnerApplicationStatus />}
/>

        {/* PROPERTY CATEGORIES */}
        <Route
          path="/apartments"
          element={<Apartments />}
        />

        <Route
          path="/villas"
          element={<Villas />}
        />

        <Route
          path="/plots"
          element={<Plots />}
        />

        <Route
          path="/independent-houses"
          element={<IndependentHouses />}
        />

        <Route
          path="/builder-floors"
          element={<BuilderFloors />}
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={<AboutUs />}
        />

        {/* WHY CHOOSE US */}
        <Route
          path="/why-choose-us"
          element={<WhyChooseUs />}
        />

        {/* NEW PROJECTS */}
        <Route
          path="/new-projects"
          element={<NewProjects />}
        />

        <Route
          path="/project/:id"
          element={<ProjectDetails />}
        />

        {/* PROPERTY DETAILS */}
        <Route
          path="/property/:id"
          element={<PropertyDetails />}
        />

        <Route
  path="/post-new-project"
  element={<PostNewProject />}
/>

        {/* POST PROPERTY */}
        <Route
          path="/post-property"
          element={<PostProperty />}
        />

        {/* FAVOURITES */}
        <Route
          path="/favourites"
          element={<Favourites />}
        />

        <Route
  path="/owners/:ownerId/properties"
  element={<OwnerProperties />}
/>
      </Routes>

      <Footer />
    </>
  );
}

export default App;