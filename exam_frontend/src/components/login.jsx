import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/usercontext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8061/api/user/login", formData);
      const userData = response.data;

      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        universityName: userData.universityName,
        role: userData.role,
      });

      setMessage("✅ Login successful!");

      // Redirect by role
      setTimeout(() => {
        const role = userData.role?.toLowerCase();
        if (role === "admin") navigate("/dashboard");
        else if (role === "university") navigate("/university/dashboard");
        else if (role === "proctor") navigate("/proctor/dashboard");
        else if (role === "student") navigate("/student/dashboard");
        else navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setMessage("❌ Invalid credentials. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] text-white p-8 rounded-lg w-full max-w-md shadow-md border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 text-white border border-gray-600"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-2 px-4 py-2 rounded bg-gray-900 text-white border border-gray-600"
        />

        <div className="text-right mb-4">
          <Link to="/forget-password" className="text-sm text-blue-400 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className={`w-full py-2 rounded transition duration-300 ${
            isLoggingIn ? "bg-gray-500 cursor-not-allowed" : "bg-white text-black hover:bg-gray-300"
          }`}
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>

        {message && <p className="mt-4 text-center text-sm text-gray-400">{message}</p>}

        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
