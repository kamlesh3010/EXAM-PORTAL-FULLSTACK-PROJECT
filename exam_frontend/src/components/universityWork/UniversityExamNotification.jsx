import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/usercontext";

const UniversityExamNotification = () => {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8061";

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`${API}/api/university/${user.id}/assignedExams`, {
        withCredentials: true,
      })
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Failed to fetch assigned exams.");
      });
  }, [user]);

  const markAsReviewed = async (examId) => {
    try {
      await axios.post(
        `${API}/api/university/exam/${examId}/markReviewed`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.examId === examId ? { ...n, status: "Reviewed" } : n
        )
      );
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to mark as reviewed.");
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 text-white bg-gradient-to-br from-gray-900 to-black">
      <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
        🎓 University Exam Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-400">No exam notifications found.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {notifications.map((exam) => (
            <div
              key={exam.examId}
              className="p-4 rounded-lg bg-[#1f1f1f] shadow border border-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-green-400">
                  {exam.examTitle}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    exam.status === "Pending"
                      ? "bg-yellow-500 text-black"
                      : "bg-green-500 text-black"
                  }`}
                >
                  {exam.status}
                </span>
              </div>
              <p>📅 Date: {exam.examDate}</p>
              <p>🆔 Exam ID: {exam.examId}</p>
              <p>👨‍💼 Assigned by Admin ID: {exam.assignedBy}</p>

              {exam.status === "Pending" && (
                <button
                  onClick={() => markAsReviewed(exam.examId)}
                  className="mt-3 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                >
                  ✅ Mark as Reviewed
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-red-400 font-medium">{message}</p>
      )}
    </div>
  );
};

export default UniversityExamNotification;
