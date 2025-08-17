package com.exam.Test.AdminController;

import com.exam.Test.Models.Exam;
import com.exam.Test.Models.Role;
import com.exam.Test.Models.Universities;
import com.exam.Test.Models.User;
import com.exam.Test.Repositories.ExamRepository;
import com.exam.Test.Repositories.UniversityRepo;
import com.exam.Test.Repositories.UserRepository;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UniversityRepo universityRepo;

   //  ✅ ADMIN LOGIN
   @PostMapping("/login")
   public ResponseEntity<String> loginUser(@RequestBody User user, HttpSession session) {
       User existingUser = userRepository.findByEmailAndPassword(user.getEmail(), user.getPassword());
       if (existingUser != null && existingUser.getRole() == Role.ADMIN) {
           session.setAttribute("admin", existingUser);
           return ResponseEntity.ok("✅ Login Successful as Admin");
       }
       return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid Credentials or Access Denied");
   }


    // ✅ GET ALL STUDENTS (GENERAL LIST)
    @GetMapping("/students-list")
    public ResponseEntity<List<User>> getAllStudent(HttpSession session) {
        User currentUser = (User) session.getAttribute("admin");
        if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<User> students = userRepository.findByRole(Role.STUDENT);
        return ResponseEntity.ok(students);
    }

    // ✅ GET STUDENTS BY UNIVERSITY NAME
    @GetMapping("/students/university/{universityName}")
    public ResponseEntity<List<User>> getStudentsByUniversity(
            @PathVariable String universityName,
            HttpSession session
    ) {
        User currentUser = (User) session.getAttribute("admin");

        if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<User> allStudents = userRepository.findByRole(Role.STUDENT);
        List<User> filtered = allStudents.stream()
                .filter(u -> u.getUniversityName() != null &&
                        u.getUniversityName().trim().equalsIgnoreCase(universityName.trim()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(filtered);
    }

    // ✅ GET STUDENTS GROUPED BY UNIVERSITY
    @GetMapping("/students/grouped")
    public ResponseEntity<Map<String, List<User>>> getStudentsGroupedByUniversity(HttpSession session) {
        User currentUser = (User) session.getAttribute("admin");

        if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<User> students = userRepository.findByRole(Role.STUDENT);

        Map<String, List<User>> grouped = students.stream()
                .filter(u -> u.getUniversityName() != null)
                .collect(Collectors.groupingBy(User::getUniversityName));

        return ResponseEntity.ok(grouped);
    }//localhost:8061/api/admin/students/grouped

    // ✅ ADD A NEW UNIVERSITY
    @PostMapping("/add-university")
    public ResponseEntity<String> addUniversity(@RequestBody Universities universities, HttpSession session) {
        User currentUser = (User) session.getAttribute("admin");

        if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (universityRepo.existsByNameIgnoreCase(universities.getName())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("University already exists");
        }

        universityRepo.save(universities);
        return ResponseEntity.ok("Added Successfully");
    }

    // ✅ GET ALL UNIVERSITIES (ADMIN ONLY)
    @GetMapping("/universities")
    public ResponseEntity<List<Universities>> getAllUniversities(HttpSession session) {
        User currentUser = (User) session.getAttribute("admin");

        if (currentUser == null || currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Universities> universities = universityRepo.findAll();
        return ResponseEntity.ok(universities);
    }

    // ✅ DELETE A UNIVERSITY
    @DeleteMapping("/delete-university/{id}")
    public ResponseEntity<String> deleteUniversity(@PathVariable Long id) {
        universityRepo.deleteById(id);
        return ResponseEntity.ok("University deleted");
    }

    // ✅ GET EXAM DETAILS
    @GetMapping("/exam/{examId}/details")
    public ResponseEntity<?> getExamDetails(@PathVariable Long examId) {
        Optional<Exam> optionalExam = examRepository.findById(examId);
        if (optionalExam.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Exam not found");
        }

        Exam exam = optionalExam.get();
        User admin = exam.getCreatedBy();

        Map<String, Object> response = new HashMap<>();
        response.put("examId", exam.getId());
        response.put("examName", exam.getDescription());
        response.put("adminId", admin != null ? admin.getId() : null);
        response.put("adminName", admin != null ? admin.getName() : "Not Assigned");

        return ResponseEntity.ok(response);
    }
}
