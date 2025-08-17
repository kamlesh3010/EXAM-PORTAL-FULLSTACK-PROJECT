import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Papa from "papaparse";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/usercontext";

const SetExamToUniversity = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [examID, setExamID] = useState("");
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8061";
  const { universityId } = useParams();

  // ✅ Load universities (with credentials)
  useEffect(() => {
    axios
      .get(`${API}/api/admin/university`, {
        withCredentials: true,
      })
      .then((res) => {
        setUniversities(res.data);
        if (universityId) setSelectedUniversity(universityId);
      })
      .catch((err) => {
        console.error("Error fetching universities", err);
        setMessage("❌ Session expired or unauthorized. Please log in again.");
      });
  }, [API, universityId]);

  // ✅ File upload and preview
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith(".csv")) {
      setMessage("❌ Only .csv files are supported for preview.");
      setPreviewData([]);
      return;
    }

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          setMessage("❌ Error parsing CSV file.");
          setPreviewData([]);
        } else {
          setPreviewData(results.data);
          setMessage("");
        }
      },
    });
  };

  // ✅ Upload exam file
  const handleUpload = async () => {
    if (!examID || !file || !selectedUniversity) {
      setMessage("❌ Please select all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("adminId", user?.id);

    try {
      const res = await axios.post(
        `${API}/api/admin/exam/${examID}/uploadFile/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // ✅ Include credentials here too
        }
      );

      setMessage(`✅ ${res.data}`);
      setFile(null);
      setPreviewData([]);
      setExamID("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-6">
      <h2 className="text-3xl text-yellow-400 font-bold text-center mb-6">
        📤 Upload Exam Questions to University
      </h2>

      <div className="max-w-xl mx-auto bg-[#1c1c1c] p-6 rounded-lg shadow-lg">
        {/* Select University */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select University</label>
          <select
            className="w-full p-2 rounded text-black"
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
          >
            <option value="">-- Select --</option>
            {universities.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.name} (ID: {uni.id})
              </option>
            ))}
          </select>
        </div>

        {/* Enter Exam ID */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Exam ID</label>
          <input
            type="text"
            className="w-full p-2 rounded text-black"
            value={examID}
            onChange={(e) => setExamID(e.target.value)}
            placeholder="Enter Exam ID"
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Upload File (.csv)</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* File Preview */}
        {previewData.length > 0 && (
          <>
            <h3 className="text-lg mt-4 mb-2 text-green-400">📊 File Preview</h3>
            <div className="overflow-x-auto max-h-64 border border-gray-700 rounded">
              <table className="w-full text-sm bg-[#2c2c2c]">
                <thead>
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th key={key} className="border p-2 bg-yellow-500 text-black">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="border-t border-gray-600">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="p-2 border">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              onClick={handleUpload}
            >
              ✅ Confirm Upload
            </button>
          </>
        )}

        {/* Feedback Message */}
        {message && (
          <p className="mt-4 text-center font-medium text-red-400">{message}</p>
        )}
      </div>
    </div>
  );
};

export default SetExamToUniversity;
