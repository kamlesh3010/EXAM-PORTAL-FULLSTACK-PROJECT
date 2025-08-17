import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExamStudentList = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchExamId, setSearchExamId] = useState("");

  useEffect(() => {
    fetchExamStudentRecords();
  }, []);

  const fetchExamStudentRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8061/api/exam/allRecord");
      setRecords(response.data);
      setFilteredRecords(response.data);
    } catch (error) {
      console.error("Error fetching exam-student records:", error);
      setError("Failed to fetch exam-student records.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchExamId.trim() === "") {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(
        (item) => item.examId.toString() === searchExamId.trim()
      );
      setFilteredRecords(filtered);
    }
  };

  const handleReset = () => {
    setSearchExamId("");
    setFilteredRecords(records);
  };

  // Grant permission API call
  const grantPermission = async (studentId, examId) => {
    try {
      await axios.put(`http://localhost:8061/api/admin/exam/grant-permission/${studentId}/${examId}`);
      fetchExamStudentRecords(); // refresh from backend
    } catch (error) {
      console.error("Error granting permission:", error);
      alert("Failed to grant permission.");
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 bg-black text-white">
      <h2 className="text-4xl font-extrabold text-orange-500 mb-8 text-center">
        Assigned Exams to Students
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Exam ID"
          value={searchExamId}
          onChange={(e) => setSearchExamId(e.target.value)}
          className="px-4 py-2 rounded bg-[#1f1f1f] text-white border border-gray-600 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p className="text-blue-400 text-lg text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 font-semibold text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-[#121212] border border-gray-700 rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-700 text-sm">
            <thead className="bg-[#1f1f1f] text-orange-300 uppercase">
              <tr>
                <th className="px-6 py-3 text-left tracking-wider">#</th>
                <th className="px-6 py-3 text-left tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left tracking-wider">Name</th>
                <th className="px-6 py-3 text-left tracking-wider">Exam ID</th>
                <th className="px-6 py-3 text-left tracking-wider">Exam Title</th>
                <th className="px-6 py-3 text-left tracking-wider">Permission</th>
                <th className="px-6 py-3 text-left tracking-wider">Completed</th>
              </tr>
            </thead>
            <tbody className="bg-[#181818] divide-y divide-gray-800">
              {filteredRecords.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#262626] transition duration-150 cursor-pointer"
                  onClick={() => setSelectedStudent(item)}
                >
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{item.studentId}</td>
                  <td className="px-6 py-3">{item.studentName}</td>
                  <td className="px-6 py-3">{item.examId}</td>
                  <td className="px-6 py-3">{item.examTitle}</td>
                  <td className="px-6 py-3">
                    {item.universityPermissionGranted ? (
                      <span className="text-green-400 font-semibold">✅ Granted</span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // avoid triggering modal
                          grantPermission(item.studentId, item.examId);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Grant
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {item.completed ? (
                      <span className="text-green-500 font-semibold">✔ Completed</span>
                    ) : (
                      <span className="text-yellow-400 font-semibold">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-[#1f1f1f] text-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-2 right-3 text-gray-300 text-xl hover:text-red-500"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Student Details</h3>
            <p><span className="font-semibold text-gray-300">Name:</span> {selectedStudent.studentName}</p>
            <p><span className="font-semibold text-gray-300">Student ID:</span> {selectedStudent.studentId}</p>
            <p><span className="font-semibold text-gray-300">Exam ID:</span> {selectedStudent.examId}</p>
            <p><span className="font-semibold text-gray-300">Exam Title:</span> {selectedStudent.examTitle}</p>
            <p><span className="font-semibold text-gray-300">Assigned On:</span> {new Date(selectedStudent.assignedOn).toLocaleString()}</p>
            <p><span className="font-semibold text-gray-300">Permission:</span> {selectedStudent.universityPermissionGranted ? "Granted" : "Denied"}</p>
            <p><span className="font-semibold text-gray-300">Duration:</span> {selectedStudent.durationMinutes} mins</p>
            <p><span className="font-semibold text-gray-300">Marks:</span> {selectedStudent.totalMarks}</p>
            <p><span className="font-semibold text-gray-300">Completed:</span> {selectedStudent.completed ? "✔ Yes" : "❌ No"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamStudentList;
