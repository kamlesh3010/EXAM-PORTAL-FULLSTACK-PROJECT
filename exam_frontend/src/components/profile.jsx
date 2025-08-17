import React, { useContext } from "react";
import { UserContext } from "../context/usercontext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-[6.5rem] bg-gradient-to-b from-black to-gray-900 flex items-center justify-center text-white">
        <h2 className="text-xl">Please log in to view your profile.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[6.5rem] bg-gradient-to-b from-black to-gray-900 flex justify-center items-center px-4">
      <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2c2c2c] text-white w-full max-w-sm p-8 rounded-2xl shadow-2xl border border-gray-800 transition-all duration-300 hover:shadow-orange-400/30">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-widest uppercase">
          Your Profile
        </h2>

        <div className="flex flex-col gap-6">
          <ProfileItem label="Name" value={user.name} />
          <ProfileItem label="Email" value={user.email} />
          <ProfileItem label="University" value={user.universityName} />
          <ProfileItem label="Role" value={user.role} />
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 font-semibold"
        >
          🔓 Logout
        </button>

        <button
          onClick={() => navigate("/update-profile")}
          className="mt-4 w-full py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 font-semibold"
        >
          ✏️ Update Profile
        </button>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-xl font-medium text-white">{value}</p>
  </div>
);

export default Profile;
