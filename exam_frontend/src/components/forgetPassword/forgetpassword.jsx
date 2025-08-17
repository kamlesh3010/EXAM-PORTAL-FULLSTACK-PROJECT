import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`http://localhost:8061/api/user/request-otp?email=${email}`);
      setMessage(res.data);
      setTimeout(() => navigate(`/verify-otp?email=${email}`), 2000);
    } catch (err) {
      setMessage(err.response?.data || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={handleOtpRequest} className="bg-[#111] p-8 rounded-lg max-w-md w-full border border-gray-700 shadow">
        <h2 className="text-2xl mb-4 text-center font-bold">Forgot Password</h2>
        <label className="block mb-2">Enter your email</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded bg-white text-black hover:bg-gray-300 transition ${loading && "opacity-50"}`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
        {message && <p className="text-sm mt-4 text-center text-gray-400">{message}</p>}
      </form>
    </div>
  );
};

export default ForgetPassword;
