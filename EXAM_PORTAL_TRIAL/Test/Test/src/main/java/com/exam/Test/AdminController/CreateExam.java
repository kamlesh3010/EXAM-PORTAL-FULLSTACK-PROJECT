package com.exam.Test.AdminController;
import com.exam.Test.DTOS.StudentExamInfoDTO;
import com.exam.Test.Models.Exam;
import com.exam.Test.Models.User;
import com.exam.Test.MyServices.ExamServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("api/admin/exam")
public class CreateExam {

    @Autowired
    private ExamServices examServices;

    @PostMapping("/{examID}/uploadFile/")
    public ResponseEntity<String> uploadCSV(@PathVariable Long examID , @RequestParam("file")MultipartFile file){
        try{
            examServices.uploadQuetionsFile(examID,file);
            return ResponseEntity.ok("✅ Questions uploaded successfully!");
        }catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(" Failed to upload: " + e.getMessage());
        }
    }

    @GetMapping("/assigned-students")
    public ResponseEntity<List<StudentExamInfoDTO>> getAllAssignedExamRecords() {
        return ResponseEntity.ok(examServices.getAllRecord());
        //localhost:8061/api/admin/exam/assigned-students
    }

    @GetMapping("/scheduled")
    public ResponseEntity<List<Exam>> getExam(){
        List<Exam> exams = examServices.getAllScheduledExams();
        return ResponseEntity.ok(exams);
    }

        @PostMapping("/assignToUniversity")
    public ResponseEntity<String> assignExamToUniversity(
            @RequestParam Long examId,
            @RequestParam Long adminId
    ){
        String msg = examServices.assignExamToAllStudents(examId, adminId);
        return ResponseEntity.ok(msg);
    }



    //University Side Granting
    @PostMapping("/assign-university")
    public ResponseEntity<String> UniversityAssigingStudent(@RequestParam String universityName
    ,@RequestParam Long examId){
        String response = examServices.assignExamToUniversityStudents(universityName,examId);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/grant-permission/{StdId}/{examId}")
    public ResponseEntity<String> grantPermission(@PathVariable Long StdId,
                                                  @PathVariable Long examId){
        String response = examServices.grantPermission(StdId, examId);
        return ResponseEntity.ok(response);

        //localhost:8061/api/admin/exam/grant-permission/12/9
    }


    @GetMapping("/assigned-stdList/{examId}")
    public ResponseEntity<List<User>> getAssignedStudent(@PathVariable Long examId){

        List<User> student=examServices.getStudentsAssignedToExam(examId);
        return ResponseEntity.ok(student);

        //localhost:8061/api/admin/exam/assigned-stdList/9
    }


    @GetMapping("/assigned-students/{StdId}")
    public ResponseEntity<List<StudentExamInfoDTO>> getStudent(@PathVariable Long stdId){
        return ResponseEntity.ok(examServices.getAssignedExamsByStudentId(stdId));
    }

}
