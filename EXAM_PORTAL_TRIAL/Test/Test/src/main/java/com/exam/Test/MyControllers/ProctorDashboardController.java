package com.exam.Test.MyControllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/proctor")
@CrossOrigin(origins = "http://localhost:5173") // adjust frontend port
public class ProctorDashboardController {

        @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String userId = (String) request.getSession().getAttribute("userId");
        return ResponseEntity.ok(Map.of("userId", userId));
    }


    @GetMapping("/dashboard/{proctorId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long proctorId) {
        Map<String, Object> res = new HashMap<>();
        res.put("students", List.of()); // replace with real assigned students
        res.put("summary", Map.of(
                "totalStudents", 0,
                "examsToday", 0,
                "alerts", 0
        ));
        return ResponseEntity.ok(res);
    }

}
