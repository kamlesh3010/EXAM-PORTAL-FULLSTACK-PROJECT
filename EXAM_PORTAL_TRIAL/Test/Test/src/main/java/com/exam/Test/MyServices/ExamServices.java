package com.exam.Test.MyServices;

import com.exam.Test.Models.*;
import com.exam.Test.DTOS.StudentExamInfoDTO;
import com.exam.Test.Repositories.ExamRepository;
import com.exam.Test.Repositories.QuestionRepository;
import com.exam.Test.Repositories.StudentExamRepository;
import com.exam.Test.Repositories.UserRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamServices {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private StudentExamRepository stdexamRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private StudentExamRepository studentExamRepository;


    public Exam createExam(Exam examRequest,Long adminId){
        User admin = userRepository.findById(adminId).orElseThrow(()-> new RuntimeException("Admin Not Found"+adminId));

        if (admin.getRole() != Role.ADMIN){
            throw new RuntimeException("Access Denied Only Admin Can Assign Exam");
        }

        if (examRequest.getDurationMinutes() == null || examRequest.getDurationMinutes() <= 0) {
            throw new RuntimeException(" durationMinutes must be greater than 0");
        }

        Exam exam = new Exam();
        exam.setTitle(examRequest.getTitle());
        exam.setDescription(examRequest.getDescription());
        exam.setTotalQuestions(examRequest.getTotalQuestions());
        exam.setDurationMinutes(examRequest.getDurationMinutes());

        exam.setCreatedBy(admin);
        exam.setIsScheduled(false);
        exam.setUniversityName(admin.getUniversityName());
        exam.setStartTime(LocalDateTime.now());
        exam.setEndTime(LocalDateTime.now().plusMinutes(examRequest.getDurationMinutes()));

        return examRepository.save(exam);

    }




    public List<Question> getQuestionsForStudentExam(Long studentId, Long examId) {
        boolean isAssigned = studentExamRepository.existsByStudentIdAndExamId(studentId, examId);
        if (!isAssigned) {
            throw new IllegalArgumentException("Student is not assigned to this exam.");
        }
        return questionRepository.findByExamId(examId);
    }




    @Transactional
    public void uploadQuetionsFile(Long examID, MultipartFile file) throws IOException {
        Exam exam = examRepository.findById(examID)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Exam Id"));

        try (
                Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())
        ) {
            for (CSVRecord record : csvParser) {
                String questionText = record.get("question").trim();
                String option1 = record.get("option1").trim();
                String option2 = record.get("option2").trim();
                String option3 = record.get("option3").trim();
                String option4 = record.get("option4").trim();
                String correctAnswer = record.get("correctAnswer").trim();

                Question question = new Question();
                question.setExam(exam);
                question.setQuestionText(questionText);

                List<ExamOption> options = new ArrayList<>();
                for (String optText : List.of(option1, option2, option3, option4)) {
                    ExamOption option = new ExamOption();
                    option.setOptionText(optText);
                    option.setQuestion(question);
                    options.add(option);
                }

                ExamOption correct = options.stream()
                        .filter(opt -> opt.getOptionText().equalsIgnoreCase(correctAnswer))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Correct answer not found among options"));

                question.setCorrectOption(correct);
                question.setOptions(options);

                questionRepository.save(question); // Options will be saved via cascade
            }

            exam.setIsScheduled(true);
            examRepository.save(exam);

        } catch (IOException e) {
            System.err.println("❌ Failed to read or parse the CSV file.");
            throw e;
        }
    }


    public Exam getExamById(Long id) {
        return examRepository.findById(id).orElse(null);
    }

    public List<StudentExamInfoDTO> getAllRecord() {
        List<StudentExam> records = stdexamRepository.findAll();

        return records.stream().map(record -> {
            User student = record.getStudent();
            Exam exam = record.getExam();

            return new StudentExamInfoDTO(
                    student != null ? student.getId() : null,
                    student != null ? student.getName() : null,
                    exam != null ? exam.getId() : null,
                    exam != null ? exam.getTitle() : null,
                    exam != null ? exam.getDescription() : null,
                    record.isCompleted(),
                    record.getAssignedOn()
            );
        }).collect(Collectors.toList());
    }


    public StudentExam assignExamToStudent(Long userId, Long examId, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access Denied: Only ADMIN can assign exams.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only STUDENT can be assigned exams.");
        }

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        if (!exam.getCreatedBy().getId().equals(adminId)) {
            throw new RuntimeException("This exam was not created by the current admin.");
        }

        StudentExam studentExam = new StudentExam();
        studentExam.setStudent(user);
        studentExam.setExam(exam);
        studentExam.setCompleted(false);
        studentExam.setAssignedOn(LocalDateTime.now());

        return stdexamRepository.save(studentExam);
    }

    public List<Exam> getAllExamByAdmin(Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin Not Found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access Denied: Only ADMIN can view created exams.");
        }

        return examRepository.findByCreatedBy(admin);
    }

    public List<Exam> checkStudentExamList(Long stdId) {
        User student = userRepository.findById(stdId)
                .orElseThrow(() -> new RuntimeException("Student Not Found"));

        if (student.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can view assigned exams.");
        }

        List<StudentExam> studentExamList = stdexamRepository.findByStudent(student);

        return studentExamList.stream()
                .map(StudentExam::getExam)
                .collect(Collectors.toList());
    }

    public List<Exam> getAllScheduledExams() {
        return examRepository.findByIsScheduledTrue();
    }

    public String assignExamToAllStudents(Long examId, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only ADMIN can assign exam to students.");
        }

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        List<User> students = userRepository.findByUniversityNameAndRole(admin.getUniversityName(), Role.STUDENT);

        int assignedCount = 0;
        for (User student : students) {
            boolean alreadyAssigned = stdexamRepository.existsByStudentAndExam(student, exam);
            if (!alreadyAssigned) {
                StudentExam se = new StudentExam();
                se.setStudent(student);
                se.setExam(exam);
                se.setAssignedOn(LocalDateTime.now());
                se.setCompleted(false);
                stdexamRepository.save(se);
                assignedCount++;
            }
        }

        return "✅ Assigned to " + assignedCount + " student(s)";
    }


    public List<Exam> getAssignedExamsForUniversity(String universityName) {
        List<User> admins = userRepository.findByUniversityNameAndRole(universityName, Role.ADMIN);
        List<Exam> assignExams = new ArrayList<>();

        for (User admin : admins) {
            List<Exam> exams = examRepository.findByCreatedBy(admin);
            assignExams.addAll(exams);
        }

        return assignExams.stream().filter(Exam::getIsScheduled).collect(Collectors.toList());
    }

    public boolean removeStudentFromExamList(Long stdid){
        Optional<Exam> studentExam =examRepository.findById(stdid);
        if (studentExam.isPresent()){
            examRepository.deleteById(stdid);
            return true;
        }else {
            return false;
        }
    }

    //Assigned To All Students exam
    public List<StudentExamInfoDTO> getAssignedExamsByStudentId(Long studentId) {
        List<StudentExam> records = stdexamRepository.findByStudentId(studentId);

        return records.stream().map(record -> {
            User student = record.getStudent();
            Exam exam = record.getExam();

            return new StudentExamInfoDTO(
                    student != null ? student.getId() : null,
                    student != null ? student.getName() : null,
                    exam != null ? exam.getId() : null,
                    exam != null ? exam.getTitle() : null,
                    exam != null ? exam.getDescription() : null,
                    record.isCompleted(),
                    record.getAssignedOn()
            );
        }).collect(Collectors.toList());
    }



    public String assignExamToUniversityStudents(String universityName,Long examId){
        Exam exam=examRepository.findById(examId).orElseThrow(()->new RuntimeException("Not Found"));

        List<User> students=userRepository.findByUniversityNameAndRole(universityName,Role.STUDENT);

        int assignedCount=0;

        for(User student : students){
            boolean exists=stdexamRepository.existsByStudentAndExam(student,exam);

            if (!exists){
                StudentExam se = new StudentExam();
                se.setStudent(student);
                se.setExam(exam);
                se.setCompleted(false);
                se.setAssignedOn(LocalDateTime.now());
                se.setUniversityPermissionGranted(false);
                stdexamRepository.save(se);
                assignedCount++;
            }
        }
        return "Assigned To "+assignedCount+" Students";
    }

    public String grantPermission(Long StdId,Long examId){
        StudentExam se =studentExamRepository.findByStudentIdAndExamId(StdId,examId).orElseThrow(
                ()-> new RuntimeException("Not Found")
        );

        se.setUniversityPermissionGranted(true);
        studentExamRepository.save(se);

        return "✅ Permission granted to student " + StdId + " for exam " + examId;
    }

    public List<User> getStudentsAssignedToExam(Long examId){
        List<StudentExam> assigend=studentExamRepository.findByExamId(examId);
        return assigend.stream().map(StudentExam :: getStudent).collect(Collectors.toList());
    }


    public List<StudentExam> getExamsByStudentId(Long studentId) {
        return studentExamRepository.findByStudentId(studentId);
    }


    // ✅ Remove one student's exam assignment
    public boolean unAssignStudent(Long examId,Long StdId){
        Optional<StudentExam> assignment=studentExamRepository.findByExamIdAndStudentId(examId,StdId);

        if (assignment.isPresent()){
            studentExamRepository.delete(assignment.get());
            return true;
        }
        return false;
    }

    /// ✅ Remove all assignments for a given university
    @Transactional
    public int allUnAssignedByCollege(Long examId,String universityName){
        return studentExamRepository.deleteByExamIdAndStudentUniversityName(examId,universityName);
    }
}
