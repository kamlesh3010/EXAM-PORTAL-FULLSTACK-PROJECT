package com.exam.Test.MyControllers;

import com.exam.Test.DTOS.SignalDTOS.IceCandidateDTO;
import com.exam.Test.DTOS.SignalDTOS.ProctorActionDTO;
import com.exam.Test.DTOS.SignalDTOS.SdpAnswerDTO;
import com.exam.Test.DTOS.SignalDTOS.SdpOfferDTO;
import com.exam.Test.MyServices.ProctorSessionRegistry;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class SignalingController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ProctorSessionRegistry registry;

    public SignalingController(SimpMessagingTemplate messagingTemplate,
                               ProctorSessionRegistry registry) {
        this.messagingTemplate = messagingTemplate;
        this.registry = registry;
    }

    // Helper: headers pinned to a specific WS session
    private MessageHeaders headersForSession(String sessionId) {
        SimpMessageHeaderAccessor headerAccessor =
                SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        return headerAccessor.getMessageHeaders();
    }

    // -------- REGISTRATION --------
    @MessageMapping("/student/register")
    public void registerStudent(@Header("student-id") Long studentId,
                                StompHeaderAccessor accessor) {
        String sid = accessor.getSessionId();
        accessor.getSessionAttributes().put("username", String.valueOf(studentId));
        registry.addStudent(sid, String.valueOf(studentId));

        // Inform all proctors a student came online (include sessionId)
        Map<String, Object> payload = Map.of(
                "studentId", String.valueOf(studentId),
                "sessionId", sid
        );
        messagingTemplate.convertAndSend("/topic/students/online", payload);
    }

    @MessageMapping("/proctor/register")
    public void registerProctor(@Header("proctor-id") Long proctorId,
                                StompHeaderAccessor accessor) {
        String sid = accessor.getSessionId();
        accessor.getSessionAttributes().put("username", String.valueOf(proctorId));
        registry.addProctor(sid, String.valueOf(proctorId));

        // Optional: broadcast proctor online
        Map<String, Object> payload = Map.of(
                "proctorId", String.valueOf(proctorId),
                "sessionId", sid
        );
        messagingTemplate.convertAndSend("/topic/proctors/online", payload);
    }

    // -------- SIGNALING --------

    // Student -> Proctor : SDP Offer
    @MessageMapping("/signal/offer")
    public void signalOffer(@Payload SdpOfferDTO offer) {
        // Broadcast to all proctors (or route to a specific proctor if you have assignment)
        messagingTemplate.convertAndSend("/topic/proctor/offers", offer);
    }

    // Proctor -> Student : SDP Answer
    @MessageMapping("/signal/answer")
    public void signalAnswer(@Payload SdpAnswerDTO answer) {
        String studentId = String.valueOf(answer.getStudentId());
        String sessionId = registry.getSessionIdForStudent(studentId);
        if (sessionId != null) {
            // Target the student's session directly
            messagingTemplate.convertAndSend("/queue/answer", answer, headersForSession(sessionId));
        }
    }

    // Bi-directional ICE
    @MessageMapping("/signal/ice")
    public void signalIce(@Payload IceCandidateDTO ice) {
        String studentId = String.valueOf(ice.getStudentId());
        if (ice.isFromProctor()) {
            // Proctor -> Student (target that student's session)
            String sessionId = registry.getSessionIdForStudent(studentId);
            if (sessionId != null) {
                messagingTemplate.convertAndSend("/queue/ice", ice, headersForSession(sessionId));
            }
        } else {
            // Student -> Proctor(s)
            messagingTemplate.convertAndSend("/topic/proctor/ice", ice);
        }
    }

    // -------- ACTIONS (Proctor -> Student) --------
    @MessageMapping("/proctor/action")
    public void proctorAction(@Payload ProctorActionDTO action) {
        String studentId = String.valueOf(action.getStudentId());
        String sessionId = registry.getSessionIdForStudent(studentId);
        if (sessionId != null) {
            messagingTemplate.convertAndSend("/queue/action", action, headersForSession(sessionId));
        }
    }
}
