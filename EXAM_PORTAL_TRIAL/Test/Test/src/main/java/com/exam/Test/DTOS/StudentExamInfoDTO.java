package com.exam.Test.DTOS;

import java.time.LocalDateTime;

public class StudentExamInfoDTO {

    private Long studentId;
    private String studentName;
    private Long examId;
    private String examTitle;
    private String examDescription;
    private boolean isCompleted;
    private LocalDateTime assignedOn;

    // ✅ New Fields
    private boolean universityPermissionGranted;
    private int durationMinutes;
    private int totalMarks;

    // ✅ Full Constructor
    public StudentExamInfoDTO(Long studentId, String studentName, Long examId, String examTitle,
                              String examDescription, boolean isCompleted, LocalDateTime assignedOn,
                              boolean universityPermissionGranted, int durationMinutes, int totalMarks) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.examId = examId;
        this.examTitle = examTitle;
        this.examDescription = examDescription;
        this.isCompleted = isCompleted;
        this.assignedOn = assignedOn;
        this.universityPermissionGranted = universityPermissionGranted;
        this.durationMinutes = durationMinutes;
        this.totalMarks = totalMarks;
    }

    // Optionally keep old constructor if needed
    public StudentExamInfoDTO(Long studentId, String studentName, Long examId, String examTitle,
                              String examDescription, boolean isCompleted, LocalDateTime assignedOn) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.examId = examId;
        this.examTitle = examTitle;
        this.examDescription = examDescription;
        this.isCompleted = isCompleted;
        this.assignedOn = assignedOn;
    }

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public String getExamDescription() {
        return examDescription;
    }

    public void setExamDescription(String examDescription) {
        this.examDescription = examDescription;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public LocalDateTime getAssignedOn() {
        return assignedOn;
    }

    public void setAssignedOn(LocalDateTime assignedOn) {
        this.assignedOn = assignedOn;
    }

    public boolean isUniversityPermissionGranted() {
        return universityPermissionGranted;
    }

    public void setUniversityPermissionGranted(boolean universityPermissionGranted) {
        this.universityPermissionGranted = universityPermissionGranted;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }
}
