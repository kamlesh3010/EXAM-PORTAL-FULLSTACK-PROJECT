// src/components/StartExam.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const StartExam = () => {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");

  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [examId, setExamId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [examPaused, setExamPaused] = useState(false);

  const stompClientRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
  };

  const cleanupMediaAndConnection = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (stompClientRef.current?.connected) {
      stompClientRef.current.disconnect(() => console.log("✅ Student disconnected WS"));
    }
  };

  useEffect(() => {
    if (!studentId) {
      alert("Student not authenticated. Please login again.");
      navigate("/check-exam");
    }
  }, [studentId, navigate]);

  useEffect(() => {
    const handleBeforeUnload = () => cleanupMediaAndConnection();
    const handlePopState = () => cleanupMediaAndConnection();
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!instructionsVisible) {
      axios
        .get(`http://localhost:8061/api/exam/student/${studentId}/start`)
        .then((res) => {
          setQuestions(res.data);
          if (res.data.length > 0) setExamId(res.data[0].examId);
          enterFullscreen();
          initWebSocketAndCamera();
        })
        .catch((err) => {
          alert(err.response?.data || "No scheduled exam found.");
          navigate("/check-exam");
        });
    }
  }, [instructionsVisible, studentId, navigate]);

  useEffect(() => {
    if (!instructionsVisible && timeLeft > 0 && !examPaused) {
      const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) handleSubmit();
  }, [instructionsVisible, timeLeft, examPaused]);

  // ======= PROCTORING: student side =======
  const initWebSocketAndCamera = async () => {
    const socket = new SockJS("http://localhost:8061/ws");
    const stompClient = over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({ "student-id": studentId }, () => {
      console.log("Student connected to WS:", studentId);

      // register this student (header carries student-id)
      stompClient.send("/app/student/register", { "student-id": studentId }, {});

      // Receive WebRTC answer from proctor (NO /user prefix)
      stompClient.subscribe("/queue/answer", async (msg) => {
        try {
          const answer = JSON.parse(msg.body);
          const desc = { type: "answer", sdp: answer.sdp };
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(desc));
          }
        } catch (err) {
          console.error("Error handling answer:", err);
        }
      });

      // Receive ICE candidate from proctor
      stompClient.subscribe("/queue/ice", async (msg) => {
        try {
          const ice = JSON.parse(msg.body);
          if (ice?.candidate && peerConnectionRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(ice.candidate));
          }
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      });

      // Receive proctor actions
      stompClient.subscribe("/queue/action", (msg) => {
        try {
          const { action } = JSON.parse(msg.body);
          handleProctorAction(action);
        } catch (err) {
          console.error("Error parsing proctor action:", err);
        }
      });

      startCameraStream();
    }, (err) => {
      console.error("STOMP connect error:", err);
    });
  };

  const handleProctorAction = (action) => {
    if (action === "warn") {
      alert("⚠ Warning from Proctor!");
    } else if (action === "pause") {
      setExamPaused(true);
      alert("⏸ Exam Paused by Proctor.");
    } else if (action === "resume") {
      setExamPaused(false);
      alert("▶ Exam Resumed by Proctor.");
    } else if (action === "end") {
      alert("🚫 Exam Ended by Proctor.");
      handleSubmit();
    }
  };

  const startCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      const videoElem = document.getElementById("studentVideo");
      if (videoElem) videoElem.srcObject = stream;

      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate && stompClientRef.current?.connected) {
          const payload = { studentId, candidate: event.candidate, fromProctor: false };
          stompClientRef.current.send("/app/signal/ice", {}, JSON.stringify(payload));
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const offerPayload = { studentId, sdp: offer.sdp };
      stompClientRef.current.send("/app/signal/offer", {}, JSON.stringify(offerPayload));
    } catch (err) {
      console.error("Camera/mic error:", err);
      alert("Camera/microphone access denied. Proctoring won't work.");
    }
  };

  // ======= EXAM FUNCTIONS =======
  const handleOptionSelect = (optionId) => {
    if (examPaused) return;
    setSelectedOption(optionId);
    const currentId = questions[currentQuestionIndex].id;
    const updatedAnswers = [
      ...answers.filter(a => a.questionId !== currentId),
      { questionId: currentId, selectedOptionId: optionId }
    ];
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (examPaused) return;
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(
        answers.find(a => a.questionId === questions[currentQuestionIndex + 1].id)?.selectedOptionId || null
      );
    }
  };

  const handlePrevious = () => {
    if (examPaused) return;
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(
        answers.find(a => a.questionId === questions[currentQuestionIndex - 1].id)?.selectedOptionId || null
      );
    }
  };

  const handleMarkForReview = () => {
    if (examPaused) return;
    const qId = questions[currentQuestionIndex].id;
    if (!markedForReview.includes(qId)) setMarkedForReview([...markedForReview, qId]);
    handleNext();
  };

  const handleSubmit = () => {
    if (!window.confirm("Submit exam?")) return;
    axios.post("http://localhost:8061/api/exam/submit-exam", { studentId, examId, answers })
      .then(() => {
        alert("Exam submitted!");
        cleanupMediaAndConnection();
        navigate("/check-exam");
      })
      .catch(() => alert("Submission failed."));
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (instructionsVisible) return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-4 text-orange-400">📜 Exam Instructions</h2>
        <ul className="text-left list-disc pl-5 space-y-2 text-lg">
          <li>Camera & mic will be recorded.</li>
          <li>Each question has one correct answer.</li>
          <li>No tab switching.</li>
        </ul>
        <button className="mt-6 bg-green-600 px-8 py-3 rounded-lg hover:bg-green-700 transition-all" onClick={() => setInstructionsVisible(false)}>🚀 Start Exam</button>
      </div>
    </div>
  );

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return <div className="h-screen flex items-center justify-center text-white bg-black"><p>Loading questions...</p></div>;

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <div className="w-1/5 p-4 border-r border-gray-700">
        <h3 className="text-lg font-semibold text-center mb-3">⏱ Time Left</h3>
        <div className="text-3xl font-bold text-center text-green-400 mb-6">{formatTime(timeLeft)}</div>
        <video id="studentVideo" autoPlay muted playsInline className="w-full rounded-lg border border-gray-600"></video>
        {examPaused && <p className="text-red-500 text-center mt-4">Exam Paused</p>}
      </div>
      <div className="w-4/5 p-10 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-orange-400">Question {currentQuestionIndex + 1} of {questions.length}</h2>
        <p className="text-lg mb-6">{currentQuestion.questionText}</p>
        <div className="space-y-3">{currentQuestion.options.map(opt => (
          <div key={opt.id} className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedOption === opt.id ? "bg-green-700 border-green-500" : "bg-gray-800 border-gray-700 hover:bg-gray-700"}`} onClick={() => handleOptionSelect(opt.id)}>
            <input type="radio" checked={selectedOption === opt.id} onChange={() => handleOptionSelect(opt.id)} className="mr-2" />
            {opt.optionText}
          </div>
        ))}</div>
        <div className="flex justify-between mt-10 gap-4">
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0 || examPaused} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg disabled:opacity-50">⬅ Previous</button>
          <button onClick={handleMarkForReview} disabled={examPaused} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black">🔖 Mark for Review</button>
          <button onClick={currentQuestionIndex === questions.length - 1 ? handleSubmit : handleNext} disabled={examPaused} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">{currentQuestionIndex === questions.length - 1 ? "✅ Submit" : "Next ➡"}</button>
        </div>
      </div>
    </div>
  );
};

export default StartExam;
