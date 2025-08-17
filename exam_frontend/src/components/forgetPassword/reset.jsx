import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const otp = queryParams.get("otp");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8061/api/user/reset-password?email=${email}&otp=${otp}&Password=${newPassword}`);
      setMessage("✅ Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage("❌ Failed to reset password. Invalid or expired OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4 text-white">
      <form onSubmit={handleReset} className="bg-[#111] p-8 rounded-lg w-full max-w-md shadow-md border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
        <label className="block mb-2">Enter New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600"
        />
        <button type="submit" className="w-full py-2 rounded bg-white text-black hover:bg-gray-300 transition">
          Reset Password
        </button>
        {message && <p className="mt-4 text-center text-sm text-gray-400">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
