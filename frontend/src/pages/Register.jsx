// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// function Register() {

//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "user"
//   });

//   const [error, setError] = useState("");


//   const handleChange = (e) => {

//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });

//   };


//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     try {

//       setError("");

//       const response = await axios.post(
//         "http://localhost:5000/api/auth/register",
//         formData
//       );


//       localStorage.setItem(
//         "token",
//         response.data.token
//       );


//       localStorage.setItem(
//         "user",
//         JSON.stringify(response.data.user)
//       );


//       alert("Registration successful");

//       navigate("/");

//     } catch (error) {

//       setError(
//         error.response?.data?.message ||
//         "Registration failed"
//       );

//     }
//   };


//   return (
//     <div className="auth-page">

//       <div className="auth-box">

//         <h2>Create Account</h2>

//         <p>
//           Register to save your favourite properties.
//         </p>


//         {error && (
//           <div className="auth-error">
//             {error}
//           </div>
//         )}


//         <form onSubmit={handleSubmit}>

//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />


//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />


//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />


//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//           >
//             <option value="user">
//               User
//             </option>

//             <option value="owner">
//               Property Owner
//             </option>
//           </select>


//           <button type="submit">
//             Register
//           </button>

//         </form>


//         <p>
//           Already have an account?{" "}
//           <Link to="/login">
//             Login
//           </Link>
//         </p>

//       </div>

//     </div>
//   );
// }

// export default Register;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
        }
      );

      const registeredUser = response.data.user;
      const token = response.data.token;

      if (!registeredUser || !token) {
        throw new Error("Registration response is incomplete.");
      }

      // Save the authenticated session.
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(registeredUser));

      // Redirect according to the account type and approval status.
      if (registeredUser.role === "owner") {
        if (registeredUser.approvalStatus === "approved") {
          alert("Your owner account is approved.");
          navigate("/owner-dashboard", { replace: true });
        } else {
          alert(
            "Registration successful! Your application is under review. We will update you within 24 hours."
          );

          navigate("/owner-application-status", {
            replace: true,
          });
        }
      } else {
        alert("Registration successful!");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Create Account</h2>

        <p>
          Register to save your favourite properties.
        </p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (minimum 8 characters)"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            aria-label="Account type"
            required
          >
            <option value="user">User</option>
            <option value="owner">Property Owner</option>
          </select>

          {formData.role === "owner" && (
            <p className="owner-review-notice">
              Owner accounts require Super Admin approval.
              Your application will remain under review until
              it is approved.
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;