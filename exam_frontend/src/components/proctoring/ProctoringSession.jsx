// src/components/ProctoringSession.jsx
import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { useLocation, useNavigate } from "react-router-dom";

const ProctoringSession = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [proctorId, setProctorId] = useState(null);
  const [students, setStudents] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const stompClientRef = useRef(null);
  const peerConnectionsRef = useRef({});

  // Resolve Proctor ID from userId
  useEffect(() => {
    const userId = location.state?.userId || localStorage.getItem("userId");
    if (!userId) {
      alert("User session expired. Please login again.");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:8061/api/proctor/get-proctor-id/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch proctor ID");
        return res.json();
      })
      .then((data) => {
        if (!data?.proctorId) throw new Error("Invalid Proctor ID response");
        setProctorId(data.proctorId);
        console.log("✅ Proctor ID resolved:", data.proctorId);
      })
      .catch((err) => {
        console.error("Error fetching proctor ID:", err);
        alert("Error resolving Proctor ID. Please login again.");
        navigate("/login");
      });
  }, [location.state, navigate]);

  // WebSocket setup & cleanup
  useEffect(() => {
    if (!proctorId) return;

    initWebSocket();

    return () => {
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
      if (stompClientRef.current?.connected) {
        stompClientRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proctorId]);

  const initWebSocket = () => {
    const socket = new SockJS("http://localhost:8061/ws");
    const stompClient = over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({ "proctor-id": proctorId }, () => {
      console.log("🟢 Proctor connected to WebSocket:", proctorId);

      // register proctor
      stompClient.send("/app/proctor/register", { "proctor-id": proctorId }, {});

      // when a student comes online
      stompClient.subscribe("/topic/students/online", (msg) => {
        try {
          const info = JSON.parse(msg.body); // { studentId, sessionId }
          const studentId = String(info.studentId);
          console.log("👨‍🎓 Student online:", info);
          setStudents((prev) => {
            if (!prev.includes(studentId)) {
              initStudentConnection(studentId);
              setAlerts((prevAlerts) => [
                ...prevAlerts,
                `Student ${studentId} joined the exam!`,
              ]);
              return [...prev, studentId];
            }
            return prev;
          });
        } catch (e) {
          console.error("Failed to parse student online payload:", e, msg.body);
        }
      });

      // receive ICE from students
      stompClient.subscribe("/topic/proctor/ice", async (msg) => {
        try {
          const ice = JSON.parse(msg.body);
          const pc = peerConnectionsRef.current[ice.studentId];
          if (pc && ice.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(ice.candidate));
            console.log("📡 Added ICE candidate for", ice.studentId);
          }
        } catch (err) {
          console.error("Error processing ICE candidate:", err);
        }
      });

      // receive SDP offers from students
      stompClient.subscribe("/topic/proctor/offers", async (msg) => {
        try {
          const offer = JSON.parse(msg.body);
          const sid = String(offer.studentId);
          console.log("📩 Received SDP offer from", sid);

          if (!peerConnectionsRef.current[sid]) {
            initStudentConnection(sid);
          }
          const pc = peerConnectionsRef.current[sid];

          await pc.setRemoteDescription({ type: "offer", sdp: offer.sdp });
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          // send answer back (controller will route to that student's session)
          stompClient.send(
            "/app/signal/answer",
            {},
            JSON.stringify({ studentId: sid, sdp: answer.sdp })
          );

          console.log("📤 Sent SDP answer to", sid);
        } catch (err) {
          console.error("Error handling SDP offer:", err);
        }
      });
    }, (err) => {
      console.error("❌ STOMP connection error:", err);
    });
  };

  // Create a PC per-student
  const initStudentConnection = (studentId) => {
    if (peerConnectionsRef.current[studentId]) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnectionsRef.current[studentId] = pc;

    pc.ontrack = (event) => {
      const videoElem = document.getElementById(`studentVideo-${studentId}`);
      if (videoElem) {
        videoElem.srcObject = event.streams[0];
        console.log("🎥 Attached stream for student:", studentId);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && stompClientRef.current?.connected) {
        stompClientRef.current.send(
          "/app/signal/ice",
          {},
          JSON.stringify({ studentId, candidate: event.candidate, fromProctor: true })
        );
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`🔗 Connection state (${studentId}):`, pc.connectionState);
    };
  };

  // Send proctor actions to student
  const sendAction = (studentId, action) => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        "/app/proctor/action",
        {},
        JSON.stringify({ studentId, action })
      );
      console.log(`📢 Sent action '${action}' to student ${studentId}`);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold text-orange-400 mb-4">🛡 Proctor Live Monitoring</h2>

      {alerts.length === 0 && (
        <p className="text-gray-400 mb-4">No students currently online</p>
      )}
      {alerts.map((alert, idx) => (
        <div key={idx} className="p-2 mb-2 bg-yellow-600 text-black rounded">
          {alert}
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((sid) => (
          <div key={sid} className="border border-gray-700 rounded-lg p-2 bg-gray-800">
            <h3 className="text-center font-semibold mb-2">Student {sid}</h3>
            <video
              id={`studentVideo-${sid}`}
              autoPlay
              playsInline
              className="w-full rounded-lg border border-gray-600"
            />
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => sendAction(sid, "warn")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded text-sm"
              >
                ⚠ Warn
              </button>
              <button
                onClick={() => sendAction(sid, "pause")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
              >
                ⏸ Pause
              </button>
              <button
                onClick={() => sendAction(sid, "end")}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                🚫 End
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProctoringSession;
