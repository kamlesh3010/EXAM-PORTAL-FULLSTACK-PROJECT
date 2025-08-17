package com.exam.Test.Repositories;

import com.exam.Test.Models.Exam;
import com.exam.Test.Models.StudentExam;
import com.exam.Test.Models.Submission;
import com.exam.Test.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    Optional<Submission> findByStudentAndExam(User student, Exam exam);


}
