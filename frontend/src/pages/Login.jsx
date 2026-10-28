// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../config";

// function Login() {

//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
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
//         `${API_URL}/auth/login`,
//         formData
//       );

//       // Save token
//       localStorage.setItem(
//         "token",
//         response.data.token
//       );

//       // Save user
//       localStorage.setItem(
//         "user",
//         JSON.stringify(response.data.user)
//       );

//       alert("Login successful");

//       navigate("/");

//     } catch (error) {

//       setError(
//         error.response?.data?.message ||
//         "Login failed"
//       );

//     }
//   };


//   return (
//     <div className="auth-page">

//       <div className="auth-box">

//         <h2>Login</h2>

//         <p>
//           Login to save your favourite properties.
//         </p>


//         {error && (
//           <div className="auth-error">
//             {error}
//           </div>
//         )}


//         <form onSubmit={handleSubmit}>

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


//           <button type="submit">
//             Login
//           </button>

//         </form>


//         <p>
//           Don't have an account?{" "}
//           <Link to="/register">
//             Register
//           </Link>
//         </p>

//       </div>

//     </div>
//   );
// }

// export default Login;




import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await axios.post(
        `${API_URL}/auth/login`,
        formData
      );

      // Save token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful");
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Login</h2>

        <p>
          Login to save your favourite properties.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            className="modal-input"
            value={formData.role}
            onChange={handleChange}
            aria-label="Account type"
            required
          >
            <option value="user">Login as User</option>
            <option value="owner">Login as Owner</option>
            <option value="superadmin">
              Login as Super Admin
            </option>
          </select>

          <button type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
