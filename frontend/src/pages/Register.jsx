import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
        "http://localhost:5000/api/auth/register",
        formData
      );


      localStorage.setItem(
        "token",
        response.data.token
      );


      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );


      alert("Registration successful");

      navigate("/");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );

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
          <div className="auth-error">
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
            required
          />


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
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">
              User
            </option>

            <option value="owner">
              Property Owner
            </option>
          </select>


          <button type="submit">
            Register
          </button>

        </form>


        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;