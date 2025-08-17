package com.exam.Test.AdminController;


import com.exam.Test.Models.Role;
import com.exam.Test.Models.User;
import com.exam.Test.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class RoleController {

    @Autowired
    private UserRepository userRepository;


    @PutMapping("/{userId}/role")
    public ResponseEntity<?> assignRole(@PathVariable Long userId,
                                        @RequestParam String role){
        Optional<User> optionalUser =userRepository.findById(userId);
        if (optionalUser.isEmpty()){
            return ResponseEntity.badRequest().body("User Not Found "+optionalUser);

        }
        if (role == null || role.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role cannot be empty");
        }

        Role assignedRole;

        try{
            assignedRole = Role.valueOf(role.trim().toUpperCase());
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body("Invalid role: " + role);
        }

        if (!(assignedRole == Role.ADMIN || assignedRole ==Role.PROCTOR || assignedRole == Role.UNIVERSITY)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(" Cannot assign role: " + assignedRole);
        }

        User user = optionalUser.get();
        user.setRole(assignedRole);
        userRepository.save(user);

        return ResponseEntity.ok(" Role '" + assignedRole + "' assigned successfully");
    }
}
