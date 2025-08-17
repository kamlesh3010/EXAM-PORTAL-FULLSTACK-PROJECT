package com.exam.Test.AdminController;

import com.exam.Test.DTOS.StudentExamInfoDTO;
import com.exam.Test.Models.Exam;
import com.exam.Test.Models.Question;
import com.exam.Test.Models.User;
import com.exam.Test.MyServices.ExamServices;
import com.exam.Test.MyServices.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam")
public class ExamController {

    @Autowired
    private ExamServices examServices;

    @Autowired
    private UserServices userServices;
    
    @PostMapping("/create/{adminId}")
    public ResponseEntity<?> createExam(@PathVariable Long adminId,
                                        @RequestBody Exam examRequest){
        try{
            Exam createExam=examServices.createExam(examRequest,adminId);
            return ResponseEntity.ok(createExam);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/allRecord")
    public ResponseEntity<List<StudentExamInfoDTO>> getAllRecords(){
        List<StudentExamInfoDTO> result=examServices.getAllRecord();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/assign-exam")
    public ResponseEntity<String> assignExam(
            @RequestParam Long userId,
            @RequestParam Long examId,
            @RequestParam Long adminId) {
        try {
            String result= String.valueOf(examServices.assignExamToStudent(userId, examId,adminId));
            return ResponseEntity.ok("Exam assigned successfully."+result);
        }catch (RuntimeException e){
            return  ResponseEntity.badRequest().body(e.getMessage());
        }

      //localhost:8061/api/exam/assign-exam?userId=5&examId=9&adminId=11
    }


    @GetMapping("/admin-exam/{adminId}")
    public  ResponseEntity<List<Exam>> getExamAdmin(@PathVariable Long adminId){
        try{
            List<Exam> exams = examServices.getAllExamByAdmin(adminId);
            return ResponseEntity.ok(exams);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(null);
        }
    }


    @GetMapping("/student-assigned-exam/{stdId}")
    public ResponseEntity<?> getExamStdData(@PathVariable long stdId){
        try{
            List<Exam> data =examServices.checkStudentExamList(stdId);
            return ResponseEntity.ok(data);
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    //Remove From Exam
    @DeleteMapping("/remove-student/{Stdid}")
    public ResponseEntity<String> removeFromExam(@PathVariable Long Stdid){

        try{
            boolean removedstd=examServices.removeStudentFromExamList(Stdid);
            if (removedstd){
                return ResponseEntity.ok("Student removed from exam successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found or already removed.");
            }

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred: " + e.getMessage());
        }
        //localhost:8061/api/exam/remove-student/5
    }


    @PostMapping("/assign/{examId}")
    public ResponseEntity<String> UniversityViseAssignment(@PathVariable Long examId,
                                                           @RequestParam String universityName){
        String result=examServices.assignExamToUniversityStudents(universityName,examId);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/unassign-single/{examId}/{stdId}")
    public ResponseEntity<String> unAssignSingleStudent(
            @PathVariable Long examId,
            @PathVariable Long stdId) {

        boolean removed = examServices.unAssignStudent(examId, stdId);
        if (removed) {
            return ResponseEntity.ok("Student ID " + stdId + " unassigned from exam " + examId);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No assignment found for student " + stdId + " and exam " + examId);
    }//localhost:8061/api/exam/unassign-single/10/19

    @PostMapping("/unassign-all/{examId}")
    public ResponseEntity<String> unassignAllStudents(
            @PathVariable Long examId,
            @RequestParam String universityName) {

        int count = examServices.allUnAssignedByCollege(examId, universityName);
        return ResponseEntity.ok(count + " students unassigned from exam " + examId);
    }

    //localhost:8061/api/exam/unassign-all/9?universityName=SPPU
}
