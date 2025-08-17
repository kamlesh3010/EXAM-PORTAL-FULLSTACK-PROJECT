import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#34a853", "#ea4335"];

const ResultMarksheet = () => {
  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const marksheetRef = useRef();

  const fetchResult = () => {
    if (!studentId || !examId) return;
    setLoading(true);
    setError("");
    axios
      .get(`http://localhost:8061/api/user/details/resultCard/${studentId}/${examId}`)
      .then((res) => {
        setResult(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch result:", err);
        setError("Result not found or server error.");
        setResult(null);
        setLoading(false);
      });
  };

  const downloadPDF = () => {
    const input = marksheetRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("University_Result_Marksheet.pdf");
    });
  };

  const getChartData = () => {
    if (!result) return [];
    return [
      { name: "Correct", value: result.correctAnswers },
      { name: "Incorrect", value: result.wrongAnswers },
    ];
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6 font-sans">
      <header className="fixed top-0 left-0 w-full z-50 px-10 py-4 flex justify-between items-center border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-3">
          <img src="/college-logo.png" alt="College Logo" className="h-10 w-10" />
          <h1 className="text-3xl font-bold text-white">National Technological University</h1>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium">Student Portal</div>
      </header>

      <div className="pt-24">
        {!result ? (
          <div className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-md p-8 mt-10">
            <h2 className="text-2xl font-semibold text-center text-white mb-6">Retrieve Result</h2>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Exam ID"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={fetchResult}
                className="w-full bg-blue-700 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition duration-300"
              >
                Get Result
              </button>
              {error && <p className="text-red-400 text-center text-sm">{error}</p>}
            </div>
          </div>
        ) : loading ? (
          <p className="text-center mt-20 text-lg font-semibold animate-pulse">Loading Result...</p>
        ) : (
          <>
            <div
              ref={marksheetRef}
              className="max-w-5xl mx-auto bg-gray-900 shadow-lg rounded-xl p-10 mt-10 space-y-8 border border-gray-700"
            >
              <div className="text-center">
                <h1 className="text-4xl font-extrabold text-blue-500 tracking-wide">Official Result Marksheet</h1>
                <p className="text-gray-400">Academic Year 2025-2026</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-sm border-y border-gray-600 py-4">
                <p><strong>Student ID:</strong> {result.studentId}</p>
                <p><strong>Name:</strong> {result.studentName}</p>
                <p><strong>Email:</strong> {result.studentEmail}</p>
                <p><strong>Exam ID:</strong> {result.examId}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Performance Chart</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={getChartData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {getChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Total Questions:</strong> {result.totalQuestions}</p>
                  <p><strong>Correct Answers:</strong> {result.correctAnswers}</p>
                  <p><strong>Wrong Answers:</strong> {result.wrongAnswers}</p>
                  <p><strong>Percentage:</strong> {result.percentage.toFixed(2)}%</p>
                  <p><strong>Grade:</strong> {result.grade}</p>
                  <p><strong>Status:</strong> {result.percentage >= 40 ? <span className="text-green-500 font-semibold">Passed</span> : <span className="text-red-500 font-semibold">Failed</span>}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6 grid grid-cols-2 text-sm text-gray-400">
                <div>
                  <p className="font-semibold text-white">Grading System</p>
                  <p>A: 90-100</p>
                  <p>B: 75-89</p>
                  <p>C: 60-74</p>
                  <p>D: 45-59</p>
                  <p>F: Below 45</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">Authorized by:</p>
                  <p>Controller of Examinations</p>
                  <p>NTU Examination Department</p>
                  <img src="/signature.png" alt="Signature" className="h-12 mt-2" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center max-w-5xl mx-auto mt-6">
              <button
                onClick={downloadPDF}
                className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition"
              >
                Download PDF
              </button>
              <a href="/results" className="text-blue-400 hover:underline font-medium">
                View All Results →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultMarksheet;
