package com.exam.Test.Repositories;

import com.exam.Test.Models.Exam;
import com.exam.Test.Models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {



    List<Exam> findByIsScheduledTrue();
    List<Exam> findByCreatedBy(User user);

}
