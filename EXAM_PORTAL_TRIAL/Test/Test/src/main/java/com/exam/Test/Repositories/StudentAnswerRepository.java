package com.exam.Test.Repositories;

import com.exam.Test.Models.StudentAnswer;
import com.exam.Test.Models.User;
import com.exam.Test.Models.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    List<StudentAnswer> findByStudentAndExam(User student, Exam exam);
    List<StudentAnswer> findByStudentId(Long studentId);

    List<StudentAnswer> findByStudentIdAndQuestion_ExamId(Long studentId, Long examId);


    @Query("SELECT DISTINCT sa.student.id FROM StudentAnswer sa WHERE sa.exam.id = :examId")
    List<Long> findDistinctStudentIdsByExamId(@Param("examId") Long examId);



    @Query("""
    SELECT new map(
        s.id AS studentId,
        s.name AS studentName,
        s.email AS studentEmail,
        s.universityName AS universityName,
        e.id AS examId,
        e.title AS examTitle,
        COUNT(sa.id) AS totalQuestions,
        SUM(CASE WHEN sa.correct = true THEN 1 ELSE 0 END) AS correctAnswers,
        SUM(CASE WHEN sa.correct = false THEN 1 ELSE 0 END) AS wrongAnswers,
        (SUM(CASE WHEN sa.correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(sa.id)) AS percentage
    )
    FROM StudentAnswer sa
    JOIN sa.student s
    JOIN sa.question q
    JOIN q.exam e
    WHERE e.id = :examId
    GROUP BY s.id, s.name, s.email, s.universityName, e.id, e.title
""")
    List<Map<String, Object>> findFullStudentResultsByExamId(@Param("examId") Long examId);







}
