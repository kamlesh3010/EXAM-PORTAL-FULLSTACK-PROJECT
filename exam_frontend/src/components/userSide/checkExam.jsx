import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckExam = () => {
  const [studentId, setStudentId] = useState("");
  const [examDetails, setExamDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const checkExam = async () => {
    if (!studentId) {
      setError("Please enter a Student ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8061/api/user/details/isScheduled/${studentId}`
      );
      setExamDetails(response.data);
      setError("");
      setShowModal(true);
    } catch (err) {
      setExamDetails(null);
      setError(
        err.response?.data?.message ||
        "Error checking exam schedule. Please try again."
      );
    }
    setLoading(false);
  };

  const handleStartExam = () => {
    if (examDetails?.id) {
      localStorage.setItem("studentId", studentId);
      navigate(`/start-exam/${examDetails.id}`);
    } else {
      alert("Exam ID not available!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStudentId("");
    setExamDetails(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-gray-800 text-white flex items-center justify-center px-4 pt-24">
      <div className="w-full max-w-xl bg-zinc-900/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl ring-1 ring-white/10 animate-slideIn">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-md">
          🎓 Check Your Exam Schedule
        </h2>

        <input
          type="number"
          placeholder="Enter Your Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-zinc-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />

        <button
          onClick={checkExam}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition transform hover:scale-105 shadow-lg shadow-blue-800/30 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check"}
        </button>

        {error && (
          <p className="text-red-400 mt-4 text-center font-medium">{error}</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm px-4">
          <div className="bg-gradient-to-br from-zinc-800 via-black to-zinc-900 rounded-3xl p-8 max-w-md w-full shadow-xl animate-popIn border border-white/10 text-white">
            {examDetails ? (
              <>
                <h3 className="text-2xl font-bold mb-4 text-center text-green-400">
                  ✅ Exam is Scheduled!
                </h3>
                <div className="text-sm text-gray-300 space-y-2 mb-6">
                  <p><strong>Title:</strong> {examDetails.title}</p>
                  <p><strong>Total Marks:</strong> {examDetails.totalMarks}</p>
                  <p><strong>Duration:</strong> {examDetails.duration} min</p>
                  <p><strong>Start Time:</strong> {new Date(examDetails.startTime).toLocaleString()}</p>
                  <p><strong>End Time:</strong> {new Date(examDetails.endTime).toLocaleString()}</p>
                </div>
                <div className="flex justify-between gap-4">
                  <button
                    onClick={handleCloseModal}
                    className="w-1/2 py-2 rounded-xl border border-gray-500 hover:bg-zinc-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartExam}
                    className="w-1/2 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition-all shadow-md hover:scale-105"
                  >
                    Start Exam
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-4 text-center text-yellow-400">
                  🚫 Exam Not Scheduled
                </h3>
                <p className="text-sm text-center mb-6 text-gray-400">
                  No scheduled exam found for this student.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 rounded-xl bg-gray-600 hover:bg-gray-700 transition-all"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </div>

          <style>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes popIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            .animate-slideIn {
              animation: slideIn 0.5s ease-out;
            }

            .animate-popIn {
              animation: popIn 0.3s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default CheckExam;
