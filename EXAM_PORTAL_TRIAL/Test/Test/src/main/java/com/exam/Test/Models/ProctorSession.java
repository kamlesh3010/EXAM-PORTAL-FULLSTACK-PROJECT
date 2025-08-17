package com.exam.Test.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ProctorSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Exam exam;

    @ManyToOne
    private User proctor;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String notes;

    public ProctorSession() {}

    public ProctorSession(Long id, Exam exam, User proctor, LocalDateTime startTime, LocalDateTime endTime, String notes) {
        this.id = id;
        this.exam = exam;
        this.proctor = proctor;
        this.startTime = startTime;
        this.endTime = endTime;
        this.notes = notes;
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Exam getExam() { return exam; }
    public void setExam(Exam exam) { this.exam = exam; }

    public User getProctor() { return proctor; }
    public void setProctor(User proctor) { this.proctor = proctor; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public String toString() {
        return "ProctorSession{" +
                "id=" + id +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", notes='" + notes + '\'' +
                '}';
    }
}
