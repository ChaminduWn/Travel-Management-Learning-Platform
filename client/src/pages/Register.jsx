import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3060/api/register", formData);
      alert("Registration successful!");
      console.log(response.data);
    } catch (error) {
      console.error("Registration failed:", error.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-lg bg-white rounded-lg overflow-hidden">
        <div className="flex-1 p-8 bg-purple-600 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Energize.</h1>
          <p className="mb-6">
            Join our vibrant community dedicated to sharing fitness tips, workout routines, healthy recipes, and inspirational stories.
          </p>
          <span className="mb-2">Do you have an account?</span>
          <Link to="/login">
            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded hover:bg-gray-200 transition">
              Login
            </button>
          </Link>
        </div>
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button type="submit" className="bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
