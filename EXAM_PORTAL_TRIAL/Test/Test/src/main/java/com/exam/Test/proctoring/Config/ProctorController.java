package com.exam.Test.proctoring.Config;

import com.exam.Test.Models.Role;
import com.exam.Test.Models.User;
import com.exam.Test.Repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/proctor")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // ✅ allow cookies/session
public class ProctorController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user, HttpSession session) {
        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser == null || !existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "❌ Invalid Email or Password"));
        }

        if (existingUser.getRole() != Role.PROCTOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "❌ Access Denied. Not a Proctor"));
        }

        // ✅ store user in session
        session.setAttribute("user", existingUser);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Login Successful as Proctor");
        response.put("proctorId", existingUser.getId());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/session")
    public ResponseEntity<?> getSession(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not logged in"));
        }
        return ResponseEntity.ok(Map.of(
                "proctorId", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/get-proctor-id/{userId}")
    public ResponseEntity<?> getProctorId(@PathVariable Long userId) {
        Optional<User> u = userRepository.findById(userId);

        if (u.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        if (u.get().getRole() != Role.PROCTOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Not a proctor"));
        }

        return ResponseEntity.ok(Map.of("proctorId", u.get().getId()));
    }
}
