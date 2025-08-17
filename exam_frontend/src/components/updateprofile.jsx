import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/usercontext";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    universityName: user.universityName,
    password: "",
  });

  const [modal, setModal] = useState({ visible: false, message: "", success: false });

  // ⏳ Auto-redirect logic after update success
  useEffect(() => {
    if (modal.visible && modal.success) {
      const timer = setTimeout(() => navigate("/"), 5000);
      return () => clearTimeout(timer);
    }
  }, [modal, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginRes = await axios.post("http://localhost:8061/api/user/login", {
        email: formData.email,
        password: formData.password,
      });

      const verifiedUser = loginRes.data;
      if (!verifiedUser || !verifiedUser.id) {
        throw new Error("Verification failed.");
      }

      const { password, ...dataToUpdate } = formData;
      const updateRes = await axios.put(`http://localhost:8061/api/user/update/${verifiedUser.id}`, dataToUpdate);

      setUser((prev) => ({ ...prev, ...dataToUpdate }));
      setModal({ visible: true, message: updateRes.data, success: true });

    } catch (error) {
      setModal({
        visible: true,
        message: error.response?.data || "❌ Update failed. Check password.",
        success: false,
      });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, visible: false });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4 text-white relative">
      <form onSubmit={handleSubmit} className="bg-[#111] p-8 rounded-lg w-full max-w-md shadow-md border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-center">Update Profile</h2>

        <label className="block mb-2">Name</label>
        <input name="name" value={formData.name} onChange={handleChange} className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600" />

        <label className="block mb-2">Email</label>
        <input name="email" value={formData.email} onChange={handleChange} className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600" />

        <label className="block mb-2">University Name</label>
        <input name="universityName" value={formData.universityName} onChange={handleChange} className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600" />

        <label className="block mb-2">Confirm Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-600" />

        <button type="submit" className="w-full py-2 rounded bg-white text-black hover:bg-gray-300 transition">
          Update
        </button>
      </form>

      {/* ✅ Modal with Close & Auto-Redirect */}
      {modal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#222] border border-gray-600 rounded-lg p-8 w-[90%] max-w-sm text-center relative">
            {/* ❌ Close Icon */}
            <button onClick={closeModal} className="absolute top-2 right-3 text-white text-xl hover:text-red-400">
              &times;
            </button>

            <h3 className={`text-lg font-semibold ${modal.success ? "text-green-400" : "text-red-400"}`}>
              {modal.message}
            </h3>
            {modal.success && (
              <p className="text-sm text-gray-400 mt-2">(Redirecting to home in 5 seconds...)</p>
            )}
            {!modal.success && (
              <button
                onClick={() => setModal({ ...modal, visible: false })}
                className="mt-6 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-300 transition"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
