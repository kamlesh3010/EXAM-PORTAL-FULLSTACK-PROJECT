package com.exam.Test.UniversityController;

import com.exam.Test.Models.User;
import com.exam.Test.Models.Role;
import com.exam.Test.Repositories.UniversityRepo;
import com.exam.Test.Repositories.UserRepository;
import com.exam.Test.Models.Universities;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class UniversityData {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UniversityRepo universityRepo;

    //  For university dropdown
    @GetMapping("/university")
    public ResponseEntity<List<Universities>> getAllUniversities(HttpSession session) {
        User currentUser = (User) session.getAttribute("admin");

        if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Universities> universities = universityRepo.findAll();
        return ResponseEntity.ok(universities);
    }

    //  Check who is logged in
    @GetMapping("/me")
    public ResponseEntity<?> whoami(HttpSession session) {
        User user = (User) session.getAttribute("admin");
        return ResponseEntity.ok(user != null ? user : "Not logged in");
    }



}
