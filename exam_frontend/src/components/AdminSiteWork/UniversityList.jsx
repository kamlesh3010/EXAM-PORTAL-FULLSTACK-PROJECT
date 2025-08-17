import { useState, useEffect } from "react";
import axios from "axios";

const UniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [newUniversity, setNewUniversity] = useState({
    name: "",
    address: "",
    city: "",
  });
  const [message, setMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get("http://localhost:8061/api/admin/university", {
        withCredentials: true,
      });
      setUniversities(response.data);
    } catch (error) {
      console.error("Failed to load universities", error);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    setNewUniversity({ ...newUniversity, [e.target.name]: e.target.value });
  };

  const handleAddUniversity = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8061/api/admin/add-university",
        newUniversity,
        { withCredentials: true }
      );
      setMessage("✅ University added successfully!");
      setNewUniversity({ name: "", address: "", city: "" });
      fetchUniversities();
    } catch (err) {
      console.error("Error adding university", err);
      setMessage("❌ Failed to add university.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(
        `http://localhost:8061/api/admin/delete-university/${deleteTarget}`,
        { withCredentials: true }
      );
      setMessage("🗑️ University deleted.");
      setDeleteTarget(null);
      fetchUniversities();
    } catch (err) {
      console.error("Error deleting university", err);
      setMessage("❌ Failed to delete university.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-32 pb-16 px-4">
      {/* Add University Form */}
      <div className="bg-[#111] p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-2xl mb-8">
        <h2 className="text-3xl font-bold text-center mb-6">Add New University</h2>

        <form onSubmit={handleAddUniversity} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="University Name"
            value={newUniversity.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newUniversity.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newUniversity.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600"
          />

          <button
            type="submit"
            className="w-full py-2 rounded bg-white text-black font-medium hover:bg-gray-300"
          >
            Add University
          </button>

          {message && <p className="text-sm text-center text-gray-400">{message}</p>}
        </form>
      </div>

      {/* List of Universities */}
      <div className="bg-[#111] p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-3xl">
        <h3 className="text-2xl font-semibold mb-4 text-center">Existing Universities</h3>
        {universities.length === 0 ? (
          <p className="text-center text-gray-400">No universities found.</p>
        ) : (
          <div className="space-y-3">
            {universities.map((uni) => (
              <div
                key={uni.id}
                className="bg-[#1e1e1e] p-4 rounded border border-gray-600 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg">{uni.name}</p>
                  <p className="text-sm text-gray-400">
                    {uni.address}, {uni.city}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(uni.id)}
                  className="text-red-400 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#222] p-6 rounded-lg border border-gray-600 text-center w-80">
            <p className="text-lg font-semibold mb-4">Confirm Deletion</p>
            <p className="text-sm text-gray-400 mb-6">Are you sure you want to delete this university?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityList;
