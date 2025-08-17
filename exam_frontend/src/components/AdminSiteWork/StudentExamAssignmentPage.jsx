import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentExamAssignmentPage = () => {
  const [groupedStudents, setGroupedStudents] = useState({});
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [examId, setExamId] = useState("");
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const [confirmData, setConfirmData] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState(new Set());

  // ✅ Fetch universities & students
  useEffect(() => {
    axios
      .get("http://localhost:8061/api/admin/students/grouped", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && typeof response.data === "object") {
          setGroupedStudents(response.data);
          const universities = Object.keys(response.data);
          if (universities.length > 0) {
            setSelectedUniversity(universities[0]);
          }
        } else {
          showPopup("error", "Invalid data format from server.");
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch students.";
        showPopup("error", msg);
      });
  }, []);

  // ✅ Popup Handler
  const showPopup = (type, message) => {
    setPopup({ show: true, type, message: String(message) });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 3000);
  };

  // ✅ Confirmation Handler
  const confirmAction = (actionType, payload) => {
    if (!examId && (actionType === "assignAll" || actionType === "unassignAll" || actionType === "assignSingle" || actionType === "unassignSingle")) {
      showPopup("error", "Please enter an exam ID first.");
      return;
    }
    setConfirmData({ actionType, payload });
  };

  // ✅ Execute Confirmed Action
  const executeConfirmedAction = () => {
    if (!confirmData) return;
    const { actionType, payload } = confirmData;
    setConfirmData(null);

    switch (actionType) {
      case "assignSingle":
        axios
          .post(
            `http://localhost:8061/api/exam/assign-single/${payload.examId}`,
            null,
            {
              params: {
                studentId: payload.studentId,
                universityName: selectedUniversity,
              },
            }
          )
          .then((res) => {
            showPopup("success", res.data || "Student assigned successfully.");
            setAssignedStudents((prev) => new Set(prev).add(payload.studentId));
          })
          .catch((err) =>
            showPopup("error", err.response?.data?.message || "Assignment Failed")
          );
        break;

      case "assignAll":
        axios
          .post(`http://localhost:8061/api/exam/assign/${payload.examId}`, null, {
            params: { universityName: selectedUniversity },
          })
          .then((res) => {
            showPopup("success", res.data || "All students assigned.");
            const uniStudents = groupedStudents[selectedUniversity] || [];
            setAssignedStudents(
              (prev) => new Set([...prev, ...uniStudents.map((s) => s.id)])
            );
          })
          .catch((err) =>
            showPopup("error", err.response?.data?.message || "Assignment Failed")
          );
        break;

      case "unassignSingle":
        axios
          .post(
            `http://localhost:8061/api/exam/unassign-single/${payload.examId}/${payload.studentId}`
          )
          .then((res) => {
            showPopup("success", res.data || "Student unassigned successfully.");
            setAssignedStudents((prev) => {
              const newSet = new Set(prev);
              newSet.delete(payload.studentId);
              return newSet;
            });
          })
          .catch((err) => {
            const msg =
              err.response?.status === 404
                ? "Student not assigned to this exam."
                : err.response?.data?.message || "Unassignment Failed";
            showPopup("error", msg);
          });
        break;

      case "unassignAll":
        axios
          .post(
            `http://localhost:8061/api/exam/unassign-all/${payload.examId}`,
            null,
            { params: { universityName: selectedUniversity } }
          )
          .then((res) => {
            showPopup("success", res.data || "All students unassigned.");
            const uniStudents = groupedStudents[selectedUniversity] || [];
            setAssignedStudents((prev) => {
              const newSet = new Set(prev);
              uniStudents.forEach((s) => newSet.delete(s.id));
              return newSet;
            });
          })
          .catch((err) =>
            showPopup(
              "error",
              err.response?.data?.message || "Unassignment Failed"
            )
          );
        break;

      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-28 px-6">
      {/* ✅ Back Button */}
      <button
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg shadow transition-transform transform hover:scale-105"
        onClick={() => window.history.back()}
      >
        ⬅ Back
      </button>

      {/* ✅ Popup Notification */}
      {popup.show && (
        <div
          className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white z-50 transform transition-all duration-500 ${
            popup.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          } ${popup.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {popup.message}
        </div>
      )}

      {/* ✅ Confirmation Modal */}
      {confirmData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center w-80">
            <p className="mb-4">Are you sure you want to proceed?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg"
                onClick={executeConfirmedAction}
              >
                Yes
              </button>
              <button
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
                onClick={() => setConfirmData(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 p-6 rounded-xl shadow-xl max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-400 text-center mb-6">
          🎓 Student Exam Assignment
        </h2>

        {/* University Select */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Select University:</label>
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600"
          >
            {Object.keys(groupedStudents).map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>

        {/* Exam ID Input */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Enter Exam ID:</label>
          <input
            type="number"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-600"
            placeholder="e.g., 101"
          />
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => confirmAction("assignAll", { examId })}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg shadow transition-transform transform hover:scale-105"
          >
            🚀 Assign to All ({selectedUniversity})
          </button>
          <button
            onClick={() => confirmAction("unassignAll", { examId })}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg shadow transition-transform transform hover:scale-105"
          >
            ❌ Unassign All ({selectedUniversity})
          </button>
        </div>

        {/* Student Table */}
        <h3 className="text-lg mb-2">
          👨‍🎓 Students in{" "}
          <span className="text-blue-400">{selectedUniversity}</span>
        </h3>

        {groupedStudents[selectedUniversity]?.length > 0 ? (
          <div className="overflow-x-auto animate-fadeIn">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Assign</th>
                  <th className="p-3">Unassign</th>
                </tr>
              </thead>
              <tbody>
                {groupedStudents[selectedUniversity].map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-700 transition"
                  >
                    <td className="p-3">{student.id}</td>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">
                      {assignedStudents.has(student.id) ? (
                        <button
                          disabled
                          className="bg-gray-500 px-3 py-1 rounded-lg cursor-not-allowed"
                        >
                          Already Assigned
                        </button>
                      ) : (
                        <button
                          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                          onClick={() =>
                            confirmAction("assignSingle", {
                              studentId: student.id,
                              examId,
                            })
                          }
                        >
                          Assign
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg transition-transform transform hover:scale-105"
                        onClick={() =>
                          confirmAction("unassignSingle", {
                            studentId: student.id,
                            examId,
                          })
                        }
                      >
                        Unassign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="italic text-gray-400">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentExamAssignmentPage;
