package com.exam.Test.MyServices;

import com.exam.Test.Models.Question;
import com.exam.Test.Models.User;
import com.exam.Test.Repositories.ExamRepository;
import com.exam.Test.Repositories.QuestionRepository;
import com.exam.Test.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserServices {


    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // ✅ Updated to return simplified data for frontend
    public List<Map<String, Object>> getAllData() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> simplifiedUsers = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());

            // Safely use name or fallback
            userMap.put("name", user.getName() != null ? user.getName() : "Unknown");

            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());

            simplifiedUsers.add(userMap);
        }

        return simplifiedUsers;
    }

    public User updateUserData(long id, User newData) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User oldData = optionalUser.get();
            oldData.setName(newData.getName());
            oldData.setEmail(newData.getEmail());
            oldData.setUniversityName(newData.getUniversityName());
            return userRepository.save(oldData);
        } else {
            return null;
        }
    }

    public User LoginUser(String mail, User data) {
        Optional<User> optionalUser = Optional.ofNullable(userRepository.findByEmail(mail));
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            if (existingUser.getPassword().equals(data.getPassword())) {
                return existingUser;
            } else {
                throw new RuntimeException("Invalid Password");
            }
        } else {
            throw new RuntimeException("User not found with email: " + mail);
        }
    }

    public boolean forgetPasswordByEmail(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setPassword(newPassword);
            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }

}
