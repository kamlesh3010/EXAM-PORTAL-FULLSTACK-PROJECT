import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/usercontext";

const ProctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8061/api/proctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Login failed");
      }

      const data = await response.json();
      console.log("✅ Proctor login success:", data);

      // ✅ Make sure we set correct structure
      const proctorUser = {
        id: data.proctorId, // map backend "proctorId" to frontend "id"
        name: data.name || email, // fallback if backend doesn’t send name
        role: "proctor",
      };

      setUser(proctorUser);
      localStorage.setItem("user", JSON.stringify(proctorUser));

      navigate("/proctor/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-gradient-to-b from-gray-900 to-black shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">
          <span className="text-orange-400">Proctor</span>{" "}
          <span className="text-purple-400">Login</span>
        </h2>

        {error && (
          <div className="bg-red-600/20 text-red-400 border border-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold shadow-lg hover:opacity-90 transition"
          >
            Login as Proctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProctorLogin;
