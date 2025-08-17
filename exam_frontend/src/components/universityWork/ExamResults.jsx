import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/** =========================
 *  Helper utilities
 *  ========================= */
const gradeFromPct = (pct) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
};

const avatarFromName = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const toCSV = (rows) => {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (s) =>
    `"${String(s ?? "").replaceAll('"', '""').replaceAll("\n", " ")}"`;
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => esc(r[h])).join(","));
  }
  return lines.join("\n");
};

/** =========================
 *  Main component
 *  ========================= */
export default function ExamResults() {
  const navigate = useNavigate();

  // form
  const [examId, setExamId] = useState("");
  // data
  const [students, setStudents] = useState([]);
  // ui state
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");
  // filters
  const [search, setSearch] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [minPct, setMinPct] = useState(0);
  const [maxPct, setMaxPct] = useState(100);
  // pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // sorting
  const [sortBy, setSortBy] = useState({ key: "studentName", dir: "asc" });

  // Optional: if you ever want to auto-read examId from query string
  // useEffect(() => {
  //   const q = new URLSearchParams(window.location.search);
  //   const id = q.get("examId");
  //   if (id) setExamId(id);
  // }, []);

  const fetchResults = async () => {
    if (!String(examId).trim()) {
      setError("Please enter an Exam ID");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8061/api/user/details/exams/${examId}/results`
      );
      if (!res.ok) {
        throw new Error(`Error fetching results: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      // Normalize + add computed fields
      const normalized = (Array.isArray(data) ? data : []).map((s) => ({
        ...s,
        percentageNum: Number(s.percentage ?? 0),
        grade: gradeFromPct(Number(s.percentage ?? 0)),
      }));
      setStudents(normalized);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || "Failed to fetch results");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortBy((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  const sortedFiltered = useMemo(() => {
    let arr = [...students];

    // Filters
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (s) =>
          (s.studentName || "").toLowerCase().includes(q) ||
          (s.studentEmail || "").toLowerCase().includes(q)
      );
    }
    if (universityFilter.trim()) {
      const u = universityFilter.toLowerCase();
      arr = arr.filter((s) =>
        (s.universityName || "").toLowerCase().includes(u)
      );
    }
    arr = arr.filter(
      (s) => s.percentageNum >= Number(minPct) && s.percentageNum <= Number(maxPct)
    );

    // Sorting
    const { key, dir } = sortBy;
    arr.sort((a, b) => {
      const A = a[key];
      const B = b[key];
      if (A == null && B == null) return 0;
      if (A == null) return dir === "asc" ? -1 : 1;
      if (B == null) return dir === "asc" ? 1 : -1;

      // numeric sort if both numbers
      if (!isNaN(A) && !isNaN(B)) {
        return dir === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
      }
      // string sort
      return dir === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });

    return arr;
  }, [students, search, universityFilter, minPct, maxPct, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedFiltered.slice(start, start + pageSize);
  }, [sortedFiltered, currentPage, pageSize]);

  // Export table CSV
  const exportTableCSV = () => {
    if (!sortedFiltered.length) return;
    const rows = sortedFiltered.map((s) => ({
      StudentName: s.studentName,
      Email: s.studentEmail,
      University: s.universityName,
      ExamTitle: s.examTitle,
      TotalQuestions: s.totalQuestions,
      Correct: s.correctAnswers,
      Wrong: s.wrongAnswers,
      Percentage: s.percentage,
      Grade: s.grade,
    }));
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam_${examId}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export selected student PDF
  const exportPDF = (s) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Live Report Card", 14, 18);
    doc.setFontSize(12);
    doc.text(`Student: ${s.studentName}`, 14, 28);
    doc.text(`Email: ${s.studentEmail}`, 14, 34);
    doc.text(`University: ${s.universityName}`, 14, 40);
    doc.text(`Exam: ${s.examTitle}`, 14, 46);

    doc.autoTable({
      startY: 54,
      head: [["Metric", "Value"]],
      body: [
        ["Total Questions", s.totalQuestions],
        ["Correct Answers", s.correctAnswers],
        ["Wrong Answers", s.wrongAnswers],
        ["Percentage", `${s.percentage}%`],
        ["Grade", s.grade],
      ],
      theme: "grid",
      styles: { fontSize: 11 },
    });

    doc.save(`${s.studentName}_Report.pdf`);
  };

  // Skeleton rows
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="p-3 border border-gray-800">
          <div className="h-4 bg-gray-800 rounded w-full" />
        </td>
      ))}
    </tr>
  );

  return (
    <div className="min-h-screen bg-black text-gray-200 pt-20">

      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-black/70 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
              aria-label="Go back"
            >
              ⬅ Back
            </button>
            <h1 className="text-2xl font-bold">Exam Results</h1>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Enter Exam ID"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 w-40"
            />
            <button
              onClick={fetchResults}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filters / Actions */}
        {students.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="🔎 Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="University filter..."
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 min-w-[60px]">
                  % Range
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={minPct}
                  onChange={(e) =>
                    setMinPct(Math.min(100, Math.max(0, Number(e.target.value))))
                  }
                  className="w-20 px-2 py-2 rounded-lg bg-gray-900 border border-gray-700"
                />
                <span className="text-gray-500">–</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={maxPct}
                  onChange={(e) =>
                    setMaxPct(Math.min(100, Math.max(0, Number(e.target.value))))
                  }
                  className="w-20 px-2 py-2 rounded-lg bg-gray-900 border border-gray-700"
                />
              </div>
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-2">
              <button
                onClick={exportTableCSV}
                className="px-4 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition"
              >
                Export CSV
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border border-red-800 bg-red-900/20 text-red-300 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Table / Cards */}
        <div className="overflow-hidden rounded-xl border border-gray-800">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-950">
                <tr className="text-left">
                  {[
                    { key: "studentName", label: "Student" },
                    { key: "studentEmail", label: "Email" },
                    { key: "universityName", label: "University" },
                    { key: "correctAnswers", label: "Correct", numeric: true },
                    { key: "wrongAnswers", label: "Wrong", numeric: true },
                    { key: "percentageNum", label: "%" , numeric: true},
                    { key: "grade", label: "Grade" },
                    { key: "action", label: "Action" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 border-b border-gray-800 ${
                        col.numeric ? "text-right" : "text-left"
                      } ${col.key !== "action" ? "cursor-pointer select-none" : ""}`}
                      onClick={
                        col.key !== "action" ? () => handleSort(col.key) : undefined
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span>{col.label}</span>
                        {sortBy.key === col.key && (
                          <span className="text-gray-500">
                            {sortBy.dir === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                  : paginated.map((s, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-900/50 transition-colors"
                      >
                        <td className="px-4 py-3 border-b border-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-700/30 border border-blue-700/40 flex items-center justify-center text-blue-300 text-xs font-bold">
                              {avatarFromName(s.studentName)}
                            </div>
                            <div className="font-medium">{s.studentName}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 border-b border-gray-900">
                          {s.studentEmail}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-900">
                          {s.universityName}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-900 text-right text-green-400 font-semibold">
                          {s.correctAnswers}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-900 text-right text-red-400 font-semibold">
                          {s.wrongAnswers}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-900 text-right">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-semibold ${
                              s.percentageNum >= 85
                                ? "bg-green-900/40 text-green-300 border border-green-800"
                                : s.percentageNum >= 70
                                ? "bg-yellow-900/40 text-yellow-300 border border-yellow-800"
                                : "bg-red-900/40 text-red-300 border border-red-800"
                            }`}
                          >
                            {s.percentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b border-gray-900">
                          <span className="px-2 py-1 rounded-md bg-gray-800 border border-gray-700">
                            {s.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b border-gray-900">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedStudent(s)}
                              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 transition"
                            >
                              View
                            </button>
                            <a
                              href={`mailto:${encodeURIComponent(
                                s.studentEmail
                              )}?subject=${encodeURIComponent(
                                `Your ${s.examTitle} result`
                              )}&body=${encodeURIComponent(
                                `Hi ${s.studentName},

Here is your result for "${s.examTitle}":

Total Questions: ${s.totalQuestions}
Correct Answers: ${s.correctAnswers}
Wrong Answers: ${s.wrongAnswers}
Percentage: ${s.percentage}%
Grade: ${s.grade}

Regards,
University`
                              )}`}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                            >
                              Email
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-900">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 animate-pulse space-y-3">
                    <div className="h-4 bg-gray-800 rounded w-1/3" />
                    <div className="h-4 bg-gray-800 rounded w-2/3" />
                    <div className="h-4 bg-gray-800 rounded w-1/2" />
                  </div>
                ))
              : paginated.map((s, idx) => (
                  <div key={idx} className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-700/30 border border-blue-700/40 flex items-center justify-center text-blue-300 text-sm font-bold">
                        {avatarFromName(s.studentName)}
                      </div>
                      <div>
                        <div className="font-semibold">{s.studentName}</div>
                        <div className="text-gray-400 text-xs">{s.studentEmail}</div>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div><span className="text-gray-400">University:</span> {s.universityName}</div>
                      <div><span className="text-gray-400">Exam:</span> {s.examTitle}</div>
                      <div className="flex gap-3">
                        <div className="text-green-400">✔ {s.correctAnswers}</div>
                        <div className="text-red-400">✖ {s.wrongAnswers}</div>
                        <div>{s.percentage}%</div>
                        <div className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-xs">{s.grade}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 transition"
                      >
                        View
                      </button>
                      <a
                        href={`mailto:${encodeURIComponent(
                          s.studentEmail
                        )}?subject=${encodeURIComponent(
                          `Your ${s.examTitle} result`
                        )}&body=${encodeURIComponent(
                          `Hi ${s.studentName},

Here is your result for "${s.examTitle}":

Total Questions: ${s.totalQuestions}
Correct Answers: ${s.correctAnswers}
Wrong Answers: ${s.wrongAnswers}
Percentage: ${s.percentage}%
Grade: ${s.grade}

Regards,
University`
                        )}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Pagination Controls */}
        {students.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-gray-900 border border-gray-700 px-2 py-1 rounded-lg"
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-gray-400 text-sm">
              Showing{" "}
              {sortedFiltered.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}{" "}
              –{" "}
              {Math.min(currentPage * pageSize, sortedFiltered.length)} of{" "}
              {sortedFiltered.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-gray-800 disabled:opacity-50 hover:bg-gray-700 transition"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.max(0, currentPage - 3) + 5
                )
                .map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === n
                        ? "bg-blue-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    } transition`}
                  >
                    {n}
                  </button>
                ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-gray-800 disabled:opacity-50 hover:bg-gray-700 transition"
              >
                Next
              </button>
              <div className="flex items-center gap-1 ml-2">
                <span className="text-gray-400 text-sm">Go to</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = Number(e.currentTarget.value);
                      if (v >= 1 && v <= totalPages) setCurrentPage(v);
                    }
                  }}
                  className="w-16 px-2 py-1 rounded-lg bg-gray-900 border border-gray-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Live Report Card */}
      {selectedStudent && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Live Report Card</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
              >
                ✖
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-700/30 border border-blue-700/40 flex items-center justify-center text-blue-300 text-sm font-bold">
                    {avatarFromName(selectedStudent.studentName)}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {selectedStudent.studentName}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {selectedStudent.studentEmail}
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  <div>
                    <span className="text-gray-400">University:</span>{" "}
                    {selectedStudent.universityName}
                  </div>
                  <div>
                    <span className="text-gray-400">Exam:</span>{" "}
                    {selectedStudent.examTitle}
                  </div>
                  <div>
                    <span className="text-gray-400">Total Questions:</span>{" "}
                    {selectedStudent.totalQuestions}
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-400">Grade:</span>{" "}
                    <span className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700">
                      {selectedStudent.grade}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => exportPDF(selectedStudent)}
                    className="px-4 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition"
                  >
                    Export PDF
                  </button>
                  <a
                    href={`mailto:${encodeURIComponent(
                      selectedStudent.studentEmail
                    )}?subject=${encodeURIComponent(
                      `Your ${selectedStudent.examTitle} result`
                    )}&body=${encodeURIComponent(
                      `Hi ${selectedStudent.studentName},

Here is your result for "${selectedStudent.examTitle}":

Total Questions: ${selectedStudent.totalQuestions}
Correct Answers: ${selectedStudent.correctAnswers}
Wrong Answers: ${selectedStudent.wrongAnswers}
Percentage: ${selectedStudent.percentage}%
Grade: ${selectedStudent.grade}

Regards,
University`
                    )}`}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                  >
                    Email Student
                  </a>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6">
                <div className="h-48 bg-gray-900 border border-gray-800 rounded-xl p-3">
                  <div className="text-sm text-gray-400 mb-2">
                    Correct vs Wrong
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Correct", value: selectedStudent.correctAnswers },
                          { name: "Wrong", value: selectedStudent.wrongAnswers },
                        ]}
                        dataKey="value"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        <Cell fill="#22c55e" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <ReTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-48 bg-gray-900 border border-gray-800 rounded-xl p-3">
                  <div className="text-sm text-gray-400 mb-2">
                    Percentage
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[{ label: selectedStudent.studentName, pct: selectedStudent.percentageNum }]}
                      margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="label" stroke="#9ca3af" />
                      <YAxis domain={[0, 100]} stroke="#9ca3af" />
                      <ReTooltip />
                      <Bar dataKey="pct" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn .25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(.98) }
          to { opacity: 1; transform: scale(1) }
        }
      `}</style>
    </div>
  );
}
