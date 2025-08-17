import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/usercontext";

const Proctoring = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    examsToday: 0,
    alerts: 0,
  });

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "proctor") {
      navigate("/proctor/login"); // ✅ send proctors to their own login
    } else {
      fetchProctorData();
    }
  }, [user]);

  const fetchProctorData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8061/api/proctor/dashboard/${user.id}`
      );
      setStudents(res.data.students || []);
      setSummary(
        res.data.summary || { totalStudents: 0, examsToday: 0, alerts: 0 }
      );
    } catch (err) {
      console.error("Error fetching proctor data:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/proctor/login");
  };

  return (
    <div className="min-h-screen bg-[#0c1222] text-white font-sans pt-20">
      {/* Dashboard Header */}
      <div className="px-8 py-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-1">Proctor Dashboard</h1>
          <p className="text-gray-400">Welcome, {user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 mb-10">
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-300">
            Students Assigned
          </h2>
          <p className="text-4xl mt-2 font-bold">{summary.totalStudents}</p>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-300">Exams Today</h2>
          <p className="text-4xl mt-2 font-bold">{summary.examsToday}</p>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-300">Alerts</h2>
          <p className="text-4xl mt-2 text-red-500 font-bold">
            {summary.alerts}
          </p>
        </div>
      </div>

      {/* Students Under Monitoring */}
      <div className="px-8 mb-10">
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Students Under Monitoring
          </h2>
          {students.length === 0 ? (
            <p className="text-gray-400">No students assigned yet.</p>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left border-b border-gray-600 text-gray-300">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Exam</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu, i) => (
                  <tr key={i} className="border-b border-gray-700 text-white">
                    <td className="py-2">{stu.name}</td>
                    <td className="py-2">{stu.email}</td>
                    <td className="py-2">{stu.examTitle}</td>
                    <td className="py-2">{stu.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-8 flex justify-end pb-10">
        <button
          onClick={() => {
            if (user?.id) {
              navigate("/proctor/live-monitoring", {
                state: { proctorId: user.id },
              });
            } else {
              alert("Session expired. Please login again.");
              navigate("/proctor/login");
            }
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-semibold"
        >
          Monitor Live Exams
        </button>
      </div>
    </div>
  );
};

export default Proctoring;
