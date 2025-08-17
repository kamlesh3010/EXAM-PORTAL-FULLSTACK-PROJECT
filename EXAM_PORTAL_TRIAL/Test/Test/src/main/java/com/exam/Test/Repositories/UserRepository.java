package com.exam.Test.Repositories;

import com.exam.Test.Models.Role;
import com.exam.Test.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);
    User findByEmail(String email);
    User findByEmailAndPassword(String email, String password);
    List<User> findByRoleAndUniversityName(Role role, String universityName);
    List<User> findByRole(Role role);

    @Query("SELECT u FROM User u WHERE u.role = :role AND LOWER(u.universityName) = LOWER(:universityName)")
    List<User> findByRoleAndUniversityNameIgnoreCase(@Param("role") Role role, @Param("universityName") String universityName);


   // List<User> findByUniversityIdAndRole(Long universityId, Role role);
    List<User> findByUniversityNameAndRole(String universityName, Role role);

}
