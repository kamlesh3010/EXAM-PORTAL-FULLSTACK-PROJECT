package com.exam.Test.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ViolationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User student;

    @ManyToOne
    private Exam exam;

    private LocalDateTime timestamp;
    private String violationType;
    private String note;

    public ViolationLog() {}

    public ViolationLog(Long id, User student, Exam exam, LocalDateTime timestamp, String violationType, String note) {
        this.id = id;
        this.student = student;
        this.exam = exam;
        this.timestamp = timestamp;
        this.violationType = violationType;
        this.note = note;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Exam getExam() { return exam; }
    public void setExam(Exam exam) { this.exam = exam; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getViolationType() { return violationType; }
    public void setViolationType(String violationType) { this.violationType = violationType; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    @Override
    public String toString() {
        return "ViolationLog{" + "id=" + id + ", violationType='" + violationType + '\'' + ", timestamp=" + timestamp + '}';
    }
}
