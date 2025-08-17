import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentList = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:8061/api/admin";

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/university`, {
          withCredentials: true,
        });
        if (Array.isArray(res.data)) {
          setUniversities(res.data);
          if (res.data.length > 0) {
            setSelectedUniversity(res.data[0].name);
          }
        }
      } catch (err) {
        console.error("❌ Failed to fetch universities", err);
        alert("Admin login required or session expired.");
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (!selectedUniversity) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/students/university/${encodeURIComponent(selectedUniversity)}`,
          { withCredentials: true }
        );
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Failed to load students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedUniversity]);

  const handleStudentClick = (student) => {
    setSelectedStudent({ ...student }); // clone to allow editing
  };

  const closeModal = () => setSelectedStudent(null);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8061/api/user/update/${selectedStudent.id}`,
        {
          name: selectedStudent.name,
          universityName: selectedStudent.universityName,
          email: selectedStudent.email, // include to avoid overwriting
        }
      );

      alert("✅ Profile updated.");
      closeModal();
      // refresh list
      setSelectedUniversity("");
      setTimeout(() => setSelectedUniversity(universities[0]?.name || ""), 100);
    } catch (err) {
      alert("❌ Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${BASE_URL}/delete-user/${selectedStudent.id}`, {
        withCredentials: true,
      });

      alert("🗑️ Student deleted.");
      setStudents(students.filter((s) => s.id !== selectedStudent.id));
      closeModal();
    } catch (err) {
      alert("❌ Failed to delete student.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pt-28 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-yellow-400">Student List</h2>

        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="bg-gray-900 text-white border border-yellow-500 px-4 py-2 rounded"
        >
          {universities.map((uni) => (
            <option key={uni.id} value={uni.name}>
              {uni.name.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading students...</p>
      ) : (
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-yellow-300">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">University</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t border-gray-700 hover:bg-gray-800 transition cursor-pointer"
                    onClick={() => handleStudentClick(student)}
                  >
                    <td className="p-3">{student.id}</td>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">{student.role}</td>
                    <td className="p-3">{student.universityName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-6">
                    No students found for this university.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔧 Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-yellow-300">
              Edit Profile
            </h3>

            <div className="mb-4">
              <label className="block mb-1 text-sm">Name</label>
              <input
                type="text"
                value={selectedStudent.name || ""}
                onChange={(e) =>
                  setSelectedStudent({ ...selectedStudent, name: e.target.value })
                }
                className="w-full bg-gray-800 border border-yellow-500 px-4 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm">University</label>
              <input
                type="text"
                value={selectedStudent.universityName || ""}
                onChange={(e) =>
                  setSelectedStudent({
                    ...selectedStudent,
                    universityName: e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-yellow-500 px-4 py-2 rounded"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
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

export default StudentList;
