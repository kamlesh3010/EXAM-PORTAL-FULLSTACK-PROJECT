package com.exam.Test.MyServices;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ProctorSessionRegistry {

    // sessionId -> studentId
    private final Map<String, String> studentBySession = new ConcurrentHashMap<>();
    // studentId -> sessionId
    private final Map<String, String> sessionByStudent = new ConcurrentHashMap<>();

    // sessionId -> proctorId
    private final Map<String, String> proctorBySession = new ConcurrentHashMap<>();
    // proctorId -> sessionId
    private final Map<String, String> sessionByProctor = new ConcurrentHashMap<>();

    public void addStudent(String sessionId, String studentId) {
        studentBySession.put(sessionId, studentId);
        sessionByStudent.put(studentId, sessionId);
    }

    public void addProctor(String sessionId, String proctorId) {
        proctorBySession.put(sessionId, proctorId);
        sessionByProctor.put(proctorId, sessionId);
    }

    public String getStudentIdBySession(String sessionId) {
        return studentBySession.get(sessionId);
    }

    public String getProctorIdBySession(String sessionId) {
        return proctorBySession.get(sessionId);
    }

    public String getSessionIdForStudent(String studentId) {
        return sessionByStudent.get(studentId);
    }

    public String getSessionIdForProctor(String proctorId) {
        return sessionByProctor.get(proctorId);
    }

    public Map<String, String> getAllStudentsBySession() {
        return studentBySession;
    }

    public Map<String, String> getAllProctorsBySession() {
        return proctorBySession;
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();

        // Remove student mappings if any
        String studentId = studentBySession.remove(sessionId);
        if (studentId != null) {
            sessionByStudent.remove(studentId);
        }

        // Remove proctor mappings if any
        String proctorId = proctorBySession.remove(sessionId);
        if (proctorId != null) {
            sessionByProctor.remove(proctorId);
        }
    }
}
