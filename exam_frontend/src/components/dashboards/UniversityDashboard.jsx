import React from "react";
import { Link } from "react-router-dom";

const UniversityDashboard = () => {
  const exampleExamId = 9; // ← Replace this with your dynamic examId as needed

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-indigo-600 to-blue-400 flex flex-col items-center justify-start p-6 text-white">
      <h1 className="text-4xl font-bold mb-4">University Dashboard</h1>
      <p className="text-lg mb-6">Welcome! Manage your university's exam ecosystem here.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <Link to="/university/create-exam" className="bg-white text-indigo-700 rounded-xl shadow-lg p-6 text-center hover:bg-indigo-50 transition-all duration-200 font-semibold">
          Create Exam
        </Link>

        <Link to="/university/view-exams" className="bg-white text-indigo-700 rounded-xl shadow-lg p-6 text-center hover:bg-indigo-50 transition-all duration-200 font-semibold">
          View Students
        </Link>

        <Link to="/university/assign-proctor" className="bg-white text-indigo-700 rounded-xl shadow-lg p-6 text-center hover:bg-indigo-50 transition-all duration-200 font-semibold">
          Assign Proctor
        </Link>

        <Link to={`/university/ViewExam/${exampleExamId}`} className="bg-white text-indigo-700 rounded-xl shadow-lg p-6 text-center hover:bg-indigo-50 transition-all duration-200 font-semibold">
          Manage Exams
        </Link>

        <Link to="/university/exam-results" className="bg-white text-indigo-700 rounded-xl shadow-lg p-6 text-center hover:bg-indigo-50 transition-all duration-200 font-semibold">
          Exam Results
        </Link>

        <Link to="/logout" className="bg-red-600 text-white rounded-xl shadow-lg p-6 text-center hover:bg-red-700 transition-all duration-200 font-semibold">
          Logout
        </Link>
      </div>
    </div>
  );
};

export default UniversityDashboard;
