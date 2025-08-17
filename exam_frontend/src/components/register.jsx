import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/usercontext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    universityName: "",
    role: "STUDENT",
  });

  const [universities, setUniversities] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Fetch universities from backend
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get("http://localhost:8061/api/user/universities");
        setUniversities(res.data);
      } catch (err) {
        console.error("Failed to load universities", err);
      }
    };

    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8061/api/user/register", formData);
      setMessage("✅ Registration successful!");

      setUser({
        name: formData.name,
        email: formData.email,
        universityName: formData.universityName,
        role: formData.role,
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        universityName: "",
        role: "STUDENT",
      });

      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage("❌ Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] text-white p-8 rounded-lg w-full max-w-md shadow-md border border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600"
        />

        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600"
        />

        <label className="block mb-2">University Name</label>
        <select
          name="universityName"
          value={formData.universityName}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600"
        >
          <option value="">-- Select University --</option>
          {universities.map((uni) => (
            <option key={uni.id} value={uni.name}>
              {uni.name}
            </option>
          ))}
        </select>

        <input type="hidden" name="role" value="STUDENT" />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded transition duration-300 ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-300"
          }`}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-400">{message}</p>
        )}

        {/* Already have an account */}
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
