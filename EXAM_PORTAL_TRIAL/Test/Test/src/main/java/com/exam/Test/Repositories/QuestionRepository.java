package com.exam.Test.Repositories;

import com.exam.Test.Models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByExamId(Long examId);

    @Query("SELECT DISTINCT q FROM Question q JOIN FETCH q.options WHERE q.exam.id = :examId")
    List<Question> findDistinctByExamId(@Param("examId") Long examId);


}
