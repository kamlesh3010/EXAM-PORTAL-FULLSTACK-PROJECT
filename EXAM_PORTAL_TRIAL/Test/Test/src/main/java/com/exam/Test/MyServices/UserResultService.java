package com.exam.Test.MyServices;


import com.exam.Test.DTOS.ExamResultDTO;
import com.exam.Test.DTOS.ResultDTO;
import com.exam.Test.Models.*;
import com.exam.Test.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserResultService {


    @Autowired
    private StudentExamRepository studentExamRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;


    @Autowired
    private SubmissionRepository submissionRepository;




    public ResponseEntity<?> calculateExamResult(Long StdId, Long examId){
        try{
            Optional<User> studentOptional =userRepository.findById(StdId);

            if (studentOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
            }
            User student = studentOptional.get();

            Optional<Exam> examOptional=examRepository.findById(examId);
            if (examOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exam not found.");
            }
            Exam exam = examOptional.get();

            List<StudentAnswer> answers = studentAnswerRepository.findByStudentIdAndQuestion_ExamId(StdId,examId);

            if (answers.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No answers submitted for this exam.");
            }

            int totalQues= answers.size();
            int correctAns=(int)answers.stream().filter(StudentAnswer ::isCorrect).count();
            int wrongAns=totalQues-correctAns;
            double percentage=((double) correctAns/totalQues)*100;

            String grade;
            if (percentage >= 90) grade = "A";
            else if (percentage >= 75) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 45) grade = "D";
            else grade = "F";

            Map<String, Object> result = new HashMap<>();
            result.put("student", student);
            result.put("exam", exam);
            result.put("totalQuestions", totalQues);
            result.put("correctAnswers", correctAns);
            result.put("wrongAnswers", wrongAns);
            result.put("percentage", percentage);
            result.put("grade", grade);

            return ResponseEntity.ok(result);
        }catch (Exception e){
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }


    public ResponseEntity<?> calculateExamResults(Long StdId, Long examId){
        try {
            Optional<User> studentOptional = userRepository.findById(StdId);
            Optional<Exam> examOptional = examRepository.findById(examId);

            if (studentOptional.isEmpty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
            if (examOptional.isEmpty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exam not found.");

            User student = studentOptional.get();
            Exam exam = examOptional.get();

            List<StudentAnswer> answers = studentAnswerRepository.findByStudentIdAndQuestion_ExamId(StdId, examId);

            if (answers.isEmpty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No answers submitted for this exam.");

            int totalQues = answers.size();
            int correctAns = (int) answers.stream().filter(StudentAnswer::isCorrect).count();
            int wrongAns = totalQues - correctAns;
            double percentage = ((double) correctAns / totalQues) * 100;

            String grade;
            if (percentage >= 90) grade = "A";
            else if (percentage >= 75) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 45) grade = "D";
            else grade = "F";

            ExamResultDTO result = new ExamResultDTO(
                    student.getId(),
                    student.getName(),
                    student.getEmail(),
                    exam.getId(),
                    exam.getTitle(),
                    totalQues,
                    correctAns,
                    wrongAns,
                    percentage,
                    grade
            );

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }




}
