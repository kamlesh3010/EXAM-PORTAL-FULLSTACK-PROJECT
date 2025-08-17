import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const handleVerify = (e) => {
    e.preventDefault();
    if (!otp || !email) return;

    // ✅ Navigate to reset password page with email & otp
    navigate(`/reset-password?email=${email}&otp=${otp}`);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4 text-white">
      <form onSubmit={handleVerify} className="bg-[#111] p-8 rounded-lg w-full max-w-md shadow-md border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-center">Verify OTP</h2>
        <label className="block mb-2">Enter OTP sent to {email}</label>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600"
        />
        <button type="submit" className="w-full py-2 rounded bg-white text-black hover:bg-gray-300 transition">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
