package com.exam.Test.AdminController;
import com.exam.Test.DTOS.*;
import com.exam.Test.Models.*;
import com.exam.Test.MyServices.ExamServices;
import com.exam.Test.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exam")
public class SetExamController {

    @Autowired
    private ExamServices examServices;

    @Autowired
    private StudentExamRepository studentExamRepository;

    @Autowired
    private QuestionRepository questionRepository;


    @Autowired
    private ExamOptionRepository examOptionRepository;

    @Autowired
    private UserRepository studentRepository;

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;


    //See All Questions And Answers
    @GetMapping("/{studentId}/{examId}/questions")
    public ResponseEntity<?> getExamQuestionsForStudent(
            @PathVariable Long studentId,
            @PathVariable Long examId) {
        try {
            List<Question> questions = examServices.getQuestionsForStudentExam(studentId, examId);
            return ResponseEntity.ok(questions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong: " + e.getMessage());
        }
    }
   //localhost:8061/api/exam/5/9/questions

    @GetMapping("/{studentId}/{examId}/OnlyQuestion")
    public ResponseEntity<?> getOnlyQuestions(
            @PathVariable Long studentId,
            @PathVariable Long examId) {
        try {
            List<Question> questions = examServices.getQuestionsForStudentExam(studentId, examId);

            // Map Question → QuestionDTO
            List<QuestionDTO> questionDTOs = questions.stream().map(q -> {
                QuestionDTO dto = new QuestionDTO();
                dto.setId(q.getId());
                dto.setQuestionText(q.getQuestionText());

                List<OptionDTO> options = q.getOptions().stream().map(opt -> {
                    OptionDTO o = new OptionDTO();
                    o.setId(opt.getId());
                    o.setOptionText(opt.getOptionText());
                    return o;
                }).collect(Collectors.toList());

                dto.setOptions(options);
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(questionDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong: " + e.getMessage());
        }
    }//localhost:8061/api/exam/17/9/OnlyQuestion


    @GetMapping("/student/{studentId}/exam/{examId}/start")
    public ResponseEntity<?> StaringExam(
            @PathVariable Long studentId,
            @PathVariable Long examId) {

        try{
        boolean isAssigned =studentExamRepository.existsByStudentIdAndExamId(studentId,examId);
        if (!isAssigned){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Student not assigned to this exam.");
        }
        List<Question> questions=questionRepository.findByExamId(examId);
        List<QuestionDTO> questionDTOs = questions.stream().map(q -> {
            QuestionDTO dto = new QuestionDTO();
            dto.setId(q.getId());
            dto.setQuestionText(q.getQuestionText());
            List<OptionDTO> options = q.getOptions().stream().map(opt -> {
                OptionDTO o = new OptionDTO();
                o.setId(opt.getId());
                o.setOptionText(opt.getOptionText());
                return o;
            }).collect(Collectors.toList());
            dto.setOptions(options);
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(questionDTOs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(" Error: " + e.getMessage());
        }
    }//localhost:8061/api/exam/student/17/exam/9/start

    @PostMapping("/submit-exam")
    public ResponseEntity<String> submitExam(@RequestBody ExamSubmissionDTO submission) {

        //  Fetch StudentExam record
        StudentExam studentExam = studentExamRepository
                .findByStudentIdAndExamId(submission.getStudentId(), submission.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not assigned to this student."));

        //  Check if already completed
        if (studentExam.isCompleted()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You have already submitted this exam. Re-attempt is not allowed.");
        }

        // Save each answer
        for (AnswerDTO ans : submission.getAnswers()) {
            Question question = questionRepository.findById(ans.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question Not Found"));

            ExamOption selectedOption = examOptionRepository.findById(ans.getSelectedOptionId())
                    .orElseThrow(() -> new RuntimeException("Option Not Found"));

            boolean correct = selectedOption.getId()
                    .equals(question.getCorrectOption().getId());

            StudentAnswer sa = new StudentAnswer();
            sa.setStudent(studentRepository.findById(submission.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student Not Found")));
            sa.setQuestion(question);
            sa.setSelectedOption(selectedOption);
            sa.setCorrect(correct);

            studentAnswerRepository.save(sa);
        }

        // 4️⃣ Mark exam as completed
        studentExam.setCompleted(true);
        studentExamRepository.save(studentExam);

        return ResponseEntity.ok("Exam submitted successfully. You cannot reattempt.");
    }


    //Only Start Exam With STd Number
    @GetMapping("/student/{studentId}/start")
    public ResponseEntity<?> startExam(@PathVariable Long studentId) {
        try {
            // Step 1: Get exams assigned to the student
            List<StudentExam> studentExams = examServices.getExamsByStudentId(studentId);

            // Step 2: Find the first scheduled exam
            StudentExam scheduledStudentExam = studentExams.stream()
                    .filter(se -> se.getExam() != null && Boolean.TRUE.equals(se.getExam().getIsScheduled()))
                    .findFirst()
                    .orElse(null);

            // Step 3: If no scheduled exam found, return error
            if (scheduledStudentExam == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No scheduled exam assigned to this student.");
            }

            // Step 4: Prevent starting if already completed
            if (scheduledStudentExam.isCompleted()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You have already completed this exam. You cannot start again.");
            }

            Exam scheduledExam = scheduledStudentExam.getExam();

            // Step 5: Fetch UNIQUE questions for the scheduled exam
            List<Question> questions = questionRepository.findDistinctByExamId(scheduledExam.getId());

            // Step 6: Map to DTO
            List<QuestionDTO> questionDTOs = questions.stream().map(q -> {
                QuestionDTO dto = new QuestionDTO();
                dto.setId(q.getId()); // question id
                dto.setQuestionText(q.getQuestionText());
                dto.setExamId(scheduledExam.getId()); // exam id

                List<OptionDTO> options = q.getOptions().stream().map(opt -> {
                    OptionDTO o = new OptionDTO();
                    o.setId(opt.getId());
                    o.setOptionText(opt.getOptionText());
                    return o;
                }).collect(Collectors.toList());

                dto.setOptions(options);
                return dto;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(questionDTOs);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }




}
