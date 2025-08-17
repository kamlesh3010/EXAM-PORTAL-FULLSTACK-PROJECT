import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UniversityDashboard = () => {
  const [universities, setUniversities] = useState([]);
  const [scheduledExams, setScheduledExams] = useState([]);
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8061";
  const navigate = useNavigate();

  // Fetch universities
  useEffect(() => {
    axios
      .get(`${API}/api/admin/university`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setUniversities(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching universities", err);
        setUniversities([]);
        alert("Session expired or unauthorized access. Please log in again.");
        navigate("/admin/login");
      });
  }, [API]);



  // Fetch scheduled exams
  useEffect(() => {
    axios
      .get(`${API}/api/admin/exam/scheduled`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setScheduledExams(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching scheduled exams", err);
      });
  }, [API]);

  const handleAssignRedirect = (uniId) => {
    navigate(`/admin/set-exam/${uniId}`);
  };

  const viewStudents = (universityName) => {
    navigate("/admin/studentslist", {
      state: { selectedUniversity: universityName },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-6">
      {/* University Dashboard Header */}
      <h1 className="text-3xl font-semibold text-center mb-8 text-yellow-400">
        🎓 University Dashboard - Assign Exams
      </h1>

      {/* University Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-[#1c1c1c] rounded-lg overflow-hidden">
          <thead className="bg-yellow-500 text-black">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">University Name</th>
              <th className="py-3 px-4 text-center">Assign Exam</th>
              <th className="py-3 px-4 text-center">Registered Students</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((uni, index) => (
              <tr key={uni.id} className="border-b border-gray-700">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{uni.name}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleAssignRedirect(uni.id)}
                    className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm"
                  >
                    Set Exam
                  </button>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => viewStudents(uni.name)}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded text-sm"
                  >
                    View Students
                  </button>
                </td>
              </tr>
            ))}
            {universities.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No universities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Scheduled Exams Section */}
      <h2 className="text-2xl font-semibold text-center mt-12 mb-4 text-green-400">
        ✅ Scheduled Exams
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-[#1c1c1c] rounded-lg overflow-hidden">
          <thead className="bg-green-500 text-black">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Duration</th>
              <th className="py-3 px-4 text-left">University</th>
              <th className="py-3 px-4 text-left">Start Time</th>
              <th className="py-3 px-4 text-left">End Time</th>
            </tr>
          </thead>
          <tbody>
            {scheduledExams.map((exam, index) => (
              <tr key={exam.id} className="border-b border-gray-700">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{exam.title}</td>
                <td className="py-2 px-4">{exam.durationMinutes} mins</td>
                <td className="py-2 px-4">{exam.universityName}</td>
                <td className="py-2 px-4">
                  {new Date(exam.startTime).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  {new Date(exam.endTime).toLocaleString()}
                </td>
              </tr>
            ))}
            {scheduledExams.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No scheduled exams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UniversityDashboard;
