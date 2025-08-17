// src/components/AdminSiteWork/AdminLogin.jsx

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/usercontext";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8061/api/admin/login", // Make sure the backend endpoint is correct
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure this header is included
          },
          withCredentials: true, // Ensure cookies are passed if you're using sessions
        }
      );

      // Assuming the response contains user details (now it's an object)
      const userData = { ...response.data, role: "admin" };
      setUser(userData);

      setMessage("✅ Admin login successful!");
      setTimeout(() => navigate("/dashboard"), 1000); // Redirect to dashboard after login
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response?.status === 403) {
        setMessage("❌ Access Denied: You are not an Admin.");
      } else if (error.response?.status === 401) {
        setMessage("❌ Invalid Email or Password.");
      } else {
        setMessage("❌ Network Error. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#222] text-white p-8 rounded-lg w-full max-w-md shadow-md border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          Admin Login
        </h2>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 text-white border border-yellow-500"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 text-white border border-yellow-500"
        />

        <button
          type="submit"
          disabled={isLoggingIn}
          className={`w-full py-2 rounded transition duration-300 ${
            isLoggingIn
              ? "bg-yellow-700 cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          {isLoggingIn ? "Logging in..." : "Login as Admin"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;
