package com.exam.Test.Repositories;

import com.exam.Test.DTOS.StudentExamInfoDTO;
import com.exam.Test.Models.Exam;
import com.exam.Test.Models.Role;
import com.exam.Test.Models.StudentExam;
import com.exam.Test.Models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface StudentExamRepository extends JpaRepository<StudentExam, Long> {

    List<StudentExam> findAll();

    List<StudentExam> findByStudent(User student);

    boolean existsByStudentAndExam(User student, Exam exam);

    boolean existsByStudentIdAndExamId(Long studentId, Long examId);

    List<StudentExam> findByStudentId(Long studentId);

    Optional<StudentExam> findByStudentIdAndExamId(Long studentId, Long examId);

    List<StudentExam> findByExamId(Long examId);



    @Query("SELECT DISTINCT se.student.id FROM StudentExam se WHERE se.exam.id = :examId")
    List<Long> findAllAssignedStudentIdsByExamId(@Param("examId") Long examId);


    Optional<StudentExam> findByExamIdAndStudentId(Long examId, Long studentId);

    @Modifying
    @Transactional
    @Query("DELETE FROM StudentExam se WHERE se.exam.id = :examId AND se.student.universityName = :universityName")
    int deleteByExamIdAndStudentUniversityName(@Param("examId") Long examId,
                                               @Param("universityName") String universityName);




}
