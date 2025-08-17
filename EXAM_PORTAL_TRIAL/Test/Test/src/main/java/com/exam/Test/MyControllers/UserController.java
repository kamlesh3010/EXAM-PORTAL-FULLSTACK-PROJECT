package com.exam.Test.MyControllers;

import com.exam.Test.DTOS.PasswordUpdateRequest;
import com.exam.Test.Models.Universities;
import com.exam.Test.Models.User;
import com.exam.Test.MyServices.OTPService;
import com.exam.Test.MyServices.UserServices;
import com.exam.Test.Repositories.UniversityRepo;
import com.exam.Test.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/user")
@RestController
public class UserController {

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UniversityRepo universityRepo;

    @Autowired
    private OTPService otpService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User users) {
        User savedUser = userServices.registerUser(users);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/universities")
    public ResponseEntity<List<Universities>> getUniversities() {
        List<Universities> universities = universityRepo.findAll();
        return ResponseEntity.ok(universities);
    }

    //  Updated return type to simplified list
    @GetMapping("/show")
    public ResponseEntity<List<Map<String, Object>>> showData() {
        List<Map<String, Object>> data = userServices.getAllData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/profile")
    public String profile() {
        return "/profile";
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUser(@PathVariable long id, @RequestBody User NewDatauser) {
        User updatedData = userServices.updateUserData(id, NewDatauser);
        if (updatedData != null) {
            return ResponseEntity.ok("User Data Updated With " + updatedData.getId());
        } else {
            return ResponseEntity.badRequest().body("Not Found " + id);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User Request) {
        try {
            String mail = Request.getEmail();
            User LoggedInUser = userServices.LoginUser(mail, Request);
            return ResponseEntity.ok(LoggedInUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/forget-password")
    public ResponseEntity<String> forgetPasswordByMail(@RequestBody PasswordUpdateRequest request) {
        boolean updated = userServices.forgetPasswordByEmail(request.getEmail(), request.getNesPassword());
        if (updated) {
            return ResponseEntity.ok("Password Is Updated " + request.getEmail());
        } else {
            return ResponseEntity.badRequest().body("User with email " + request.getEmail() + " not found.");
        }
    }

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestParam String email) {
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("User not found with email: " + email);
        }

        otpService.getOpt(email);
        return ResponseEntity.ok("OTP Sent To Your Email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassOtp(@RequestParam String email,
                                               @RequestParam String otp,
                                               @RequestParam String Password) {
        if (otpService.verifyOtp(email, otp)) {
            User user = userRepository.findByEmail(email);
            user.setPassword(Password);
            userRepository.save(user);
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }
    }
}
