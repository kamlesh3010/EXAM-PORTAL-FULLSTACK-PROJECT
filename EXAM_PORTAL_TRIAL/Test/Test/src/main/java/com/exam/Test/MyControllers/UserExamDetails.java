package com.exam.Test.MyControllers;
import com.exam.Test.DTOS.ResultDTO;
import com.exam.Test.Models.Exam;
import com.exam.Test.Models.StudentAnswer;
import com.exam.Test.Models.StudentExam;
import com.exam.Test.Models.User;
import com.exam.Test.MyServices.ExamServices;
import com.exam.Test.MyServices.UserResultService;

import com.exam.Test.MyServices.UserServices;
import com.exam.Test.Repositories.StudentAnswerRepository;
import com.exam.Test.Repositories.StudentExamRepository;
import com.exam.Test.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/user/details")
public class UserExamDetails {


    @Autowired
    private ExamServices examServices;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserResultService userResultService;

    @Autowired
    private StudentExamRepository studentExamRepository;

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    @GetMapping("/isScheduled/{studentId}")
    public ResponseEntity<?> isAnyExamScheduled(@PathVariable Long studentId) {
        List<StudentExam> studentExams = examServices.getExamsByStudentId(studentId);

        for(StudentExam se : studentExams){
            Exam exam =se.getExam();

            if (exam != null && Boolean.TRUE.equals(exam.getIsScheduled())) {
                return ResponseEntity.ok(exam);  // Return full exam details
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No scheduled exam assigned to this student.");
    }



    @GetMapping("/student/{StdId}/{examId}/result")
    public  ResponseEntity<?> getExamResult(@PathVariable Long StdId,
                                            @PathVariable Long examId){

        try{
            List<StudentAnswer> answers =studentAnswerRepository.findByStudentIdAndQuestion_ExamId(StdId,examId);

            if (answers.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No answers submitted for this exam.");
            }
            int totalQuestions=answers.size();
            int correctAns=(int)answers.stream().filter(StudentAnswer::isCorrect).count();
            int wrongAns=totalQuestions -correctAns;
            double percentage=((double) correctAns/totalQuestions)*100;

            String grade;
            if (percentage >= 90) grade = "A";
            else if (percentage >= 75) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 45) grade = "D";
            else grade = "F";

            Map<String,Object> result=new HashMap<>();
            result.put("StdId",StdId);
            result.put("examId",examId);
            result.put("totalQuestions", totalQuestions);
            result.put("correctAnswers", correctAns);
            result.put("wrongAnswers", wrongAns);
            result.put("percentage", percentage);
            result.put("grade", grade);

            return ResponseEntity.ok(result);

        }catch (Exception e){
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }//localhost:8061/api/user/details/student/18/11/result



    @GetMapping("resultCard/{StdId}/{examId}")
    public ResponseEntity<?> getExamResultDetail(@PathVariable Long StdId,
                                                 @PathVariable Long examId){
        return userResultService.calculateExamResults(StdId,examId);
    }



    @GetMapping("/exam/{examId}/results")
    public ResponseEntity<?> getAllStudentsResult(@PathVariable Long examId) {
        try {
            // ✅ Get all assigned students, not just those who answered
            List<Long> students = studentExamRepository.findAllAssignedStudentIdsByExamId(examId);

            if (students.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No students found for this exam.");
            }

            List<Map<String, Object>> resultList = new ArrayList<>();

            for (Long studentId : students) {
                ResponseEntity<?> resultResponse = getExamResult(studentId, examId);
                if (resultResponse.getStatusCode() == HttpStatus.OK) {
                    resultList.add((Map<String, Object>) resultResponse.getBody());
                }
            }

            return ResponseEntity.ok(resultList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }



    @GetMapping("/exams/{examId}/results")
    public ResponseEntity<?> getAllStudentsResults(@PathVariable Long examId) {
        List<Map<String, Object>> results = studentAnswerRepository.findFullStudentResultsByExamId(examId);
        if (results.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No students have submitted answers for this exam.");
        }
        return ResponseEntity.ok(results);
    }



    @GetMapping("/student/{StdId}/exams/results")
    public ResponseEntity<?> getStudentAllExamResults(@PathVariable Long StdId) {
        try {
            // ✅ Get all exams assigned to this student
            List<StudentExam> studentExams = examServices.getExamsByStudentId(StdId);

            if (studentExams.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No exams assigned to this student.");
            }

            List<Map<String, Object>> resultList = new ArrayList<>();

            for (StudentExam se : studentExams) {
                Exam exam = se.getExam();
                if (exam != null) {
                    // Fetch student's answers for this exam
                    List<StudentAnswer> answers = studentAnswerRepository.findByStudentIdAndQuestion_ExamId(StdId, exam.getId());

                    Map<String, Object> examResult = new HashMap<>();
                    examResult.put("examId", exam.getId());
                    examResult.put("examTitle", exam.getTitle());
                    examResult.put("isScheduled", exam.getIsScheduled());

                    if (answers.isEmpty()) {
                        examResult.put("status", "Not Attempted");
                        examResult.put("totalQuestions", 0);
                        examResult.put("correctAnswers", 0);
                        examResult.put("wrongAnswers", 0);
                        examResult.put("percentage", 0.0);
                        examResult.put("grade", "N/A");
                    } else {
                        int totalQuestions = answers.size();
                        int correctAns = (int) answers.stream().filter(StudentAnswer::isCorrect).count();
                        int wrongAns = totalQuestions - correctAns;
                        double percentage = ((double) correctAns / totalQuestions) * 100;

                        String grade;
                        if (percentage >= 90) grade = "A";
                        else if (percentage >= 75) grade = "B";
                        else if (percentage >= 60) grade = "C";
                        else if (percentage >= 45) grade = "D";
                        else grade = "F";

                        examResult.put("status", "Attempted");
                        examResult.put("totalQuestions", totalQuestions);
                        examResult.put("correctAnswers", correctAns);
                        examResult.put("wrongAnswers", wrongAns);
                        examResult.put("percentage", percentage);
                        examResult.put("grade", grade);
                    }

                    resultList.add(examResult);
                }
            }

            return ResponseEntity.ok(resultList);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
 //localhost:8061/api/user/details/student/1/exams/results
}
