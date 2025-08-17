import React, { useState } from "react";
import axios from "axios";

const ViewExam = () => {
  const [examId, setExamId] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [granting, setGranting] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    if (!examId.trim()) {
      alert("Please enter an exam ID");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:8061/api/admin/exam/assigned-stdList/${examId}`
      );
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
      setStudents([]);
      setError("Failed to fetch students. Please check the exam ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleGrant = async () => {
    if (!selectedStudent) return;
    setGranting(true);
    try {
      await axios.put(
        `http://localhost:8061/api/admin/exam/grant-permission/${selectedStudent}/${examId}`
      );
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent ? { ...s, granted: true } : s
        )
      );
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to grant permission");
    } finally {
      setGranting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-800 text-white pt-24 px-6">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl ring-1 ring-white/10">
        <h2 className="text-3xl font-bold mb-6 border-b border-white/20 pb-2">
          View Assigned Students
        </h2>

        {/* Exam ID Input */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter Exam ID"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            className="px-4 py-2 rounded-md text-black w-64"
          />
          <button
            onClick={fetchStudents}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch Students"}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-300 mb-4">{error}</p>}

        {/* Student Table */}
        {students.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl shadow">
            <table className="min-w-full text-sm text-white border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left bg-white/10 uppercase text-xs tracking-wider text-white/80">
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="bg-white/10 hover:bg-white/20 transition-all rounded-xl shadow-sm"
                  >
                    <td className="px-6 py-4 rounded-l-xl">{student.id}</td>
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4 text-center rounded-r-xl">
                      {student.granted ? (
                        <span className="text-green-400 font-semibold">
                          Granted
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedStudent(student.id);
                            setShowModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow transition"
                        >
                          Grant Permission
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !loading && !error ? (
          <p className="text-sm text-red-300 mt-4">No students loaded.</p>
        ) : null}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white text-black rounded-xl p-6 w-[90%] max-w-md shadow-2xl animate-fadeInUp">
            <h3 className="text-lg font-bold mb-3">Confirm Grant</h3>
            <p className="text-sm">
              Are you sure you want to grant permission to student ID:{" "}
              <strong>{selectedStudent}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
                disabled={granting}
              >
                Cancel
              </button>
              <button
                onClick={handleGrant}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                disabled={granting}
              >
                {granting ? "Granting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ViewExam;
