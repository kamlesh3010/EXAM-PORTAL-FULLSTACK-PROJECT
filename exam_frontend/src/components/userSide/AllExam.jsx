// src/components/AllExam.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const AllExam = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("studentId"); // ✅ stored after login

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8061/api/user/details/student/${studentId}/exams/results`
        );
        setExams(res.data);
      } catch (err) {
        setError(err.response?.data || "Failed to fetch exams");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [studentId]);

  if (loading)
    return (
      <p className="text-center text-lg mt-20 text-gray-400 animate-pulse">
        Loading exams...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-black p-6 text-white mt-20">
      {/* 👆 Added mt-20 (~2 inch down on most screens) */}

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-12 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#e99b63] to-[#ffad73] drop-shadow-lg"
      >
        📚 My Exams
      </motion.h1>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {exams.map((exam, index) => (
          <motion.div
            key={exam.examId}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 25px rgba(233,155,99,0.3)",
              borderColor: "#e99b63",
            }}
            className="bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] shadow-lg rounded-2xl p-6 border border-gray-700 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-[#e99b63]">
              {exam.examTitle}
            </h2>
            <p className="text-gray-400 mb-3 text-sm">
              Exam ID: {exam.examId}
            </p>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-300">Status:</span>{" "}
                <span
                  className={
                    exam.status === "Attempted"
                      ? "text-green-400 font-semibold"
                      : "text-yellow-400 font-semibold"
                  }
                >
                  {exam.status}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-300">
                  Total Questions:
                </span>{" "}
                {exam.totalQuestions}
              </p>
              <p>
                <span className="font-medium text-gray-300">Correct:</span>{" "}
                <span className="text-green-400">{exam.correctAnswers}</span> |{" "}
                <span className="font-medium text-gray-300">Wrong:</span>{" "}
                <span className="text-red-400">{exam.wrongAnswers}</span>
              </p>
              <p>
                <span className="font-medium text-gray-300">Percentage:</span>{" "}
                <span className="text-blue-400">
                  {exam.percentage.toFixed(2)}%
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-300">Grade:</span>{" "}
                <span className="font-bold text-[#e99b63]">{exam.grade}</span>
              </p>
            </div>

            <div className="mt-5 flex justify-end items-center">
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  exam.isScheduled
                    ? "bg-green-900 text-green-300"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {exam.isScheduled ? "Scheduled" : "Not Scheduled"}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AllExam;
