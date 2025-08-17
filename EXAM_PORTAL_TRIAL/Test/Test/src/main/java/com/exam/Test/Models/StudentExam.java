package com.exam.Test.Models;

import jakarta.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;

@Entity
public class StudentExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User student;

    @ManyToOne
    private Exam exam;

    private boolean universityPermissionGranted = false;

    private boolean isCompleted;

    private LocalDateTime assignedOn;

    private Duration timeTaken;  // ✅ added this field

    public StudentExam() {}

    public StudentExam(Long id, User student, Exam exam, boolean isCompleted, LocalDateTime assignedOn, Duration timeTaken) {
        this.id = id;
        this.student = student;
        this.exam = exam;
        this.isCompleted = isCompleted;
        this.assignedOn = assignedOn;
        this.timeTaken = timeTaken;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Exam getExam() { return exam; }
    public void setExam(Exam exam) { this.exam = exam; }

    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }

    public LocalDateTime getAssignedOn() { return assignedOn; }
    public void setAssignedOn(LocalDateTime assignedOn) { this.assignedOn = assignedOn; }

    public boolean isUniversityPermissionGranted() { return universityPermissionGranted; }
    public void setUniversityPermissionGranted(boolean universityPermissionGranted) { this.universityPermissionGranted = universityPermissionGranted; }

    public Duration getTimeTaken() { return timeTaken; }
    public void setTimeTaken(Duration timeTaken) { this.timeTaken = timeTaken; }

    @Override
    public String toString() {
        return "StudentExam{" +
                "id=" + id +
                ", isCompleted=" + isCompleted +
                ", assignedOn=" + assignedOn +
                ", timeTaken=" + timeTaken +
                '}';
    }
}
