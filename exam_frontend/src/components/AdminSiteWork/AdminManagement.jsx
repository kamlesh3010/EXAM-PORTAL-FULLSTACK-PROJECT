import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserShield } from "react-icons/fa";

const AdminManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [accessType, setAccessType] = useState("");

  const baseURL = "http://localhost:8061"; // ✅ Your Spring Boot backend

  useEffect(() => {
    axios
      .get(`${baseURL}/api/user/show`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      });
  }, []);

  const openAccessModal = (user) => {
    setSelectedUser(user);
    setAccessType("");
    setShowModal(true);
  };

  const handleAccessUpdate = async () => {
    if (!selectedUser || !accessType) return;

    try {
      await axios.put(`${baseURL}/api/admin/${selectedUser.id}/role`, null, {
        params: { role: accessType },
      });

      alert(`${selectedUser.name} has been granted '${accessType.toUpperCase()}' access.`);
      setShowModal(false);
      setAccessType("");

      // Refresh user list
      const res = await axios.get(`${baseURL}/api/user/show`);
      setUsers(res.data);
    } catch (err) {
      console.error("Access update failed", err);
      alert("Something went wrong while assigning role.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-6">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center gap-2">
        <FaUserShield /> Admin / University / Proctor Access Management
      </h2>

      <div className="overflow-x-auto bg-[#111] rounded-lg border border-gray-700 shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-yellow-400">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Current Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="p-4">{user.id}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 capitalize">{user.role}</td>
                  <td className="p-4 text-center">
                    <button
                      className="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded text-sm"
                      onClick={() => openAccessModal(user)}
                    >
                      Give Access
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 border border-yellow-400">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">
              Assign Role to: {selectedUser.name}
            </h3>
            <div className="flex flex-col gap-4">
              {["admin", "university", "proctor"].map((role) => (
                <button
                  key={role}
                  onClick={() => setAccessType(role)}
                  className={`px-4 py-2 rounded ${
                    accessType === role
                      ? "ring-2 ring-yellow-300"
                      : "hover:bg-opacity-90"
                  } ${
                    role === "admin"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : role === "university"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {role.toUpperCase()}
                </button>
              ))}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setAccessType("");
                  }}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccessUpdate}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
