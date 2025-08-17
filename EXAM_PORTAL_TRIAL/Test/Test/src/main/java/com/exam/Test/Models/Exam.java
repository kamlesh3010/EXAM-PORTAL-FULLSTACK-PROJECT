package com.exam.Test.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Integer totalQuestions;

    @Column(name = "isScheduled")
    private Boolean isScheduled = false;

    private Integer durationMinutes;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String universityName;

    // Many exams can be created by one user
    @ManyToOne
    @JoinColumn(name = "created_by")
    @JsonBackReference // Prevents infinite loop when serializing Exam → User → Exam
    private User createdBy;

    // One exam has many questions
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Allows serialization of Exam → Question
    private List<Question> questions;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<StudentExam> studentExams;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Submission> submissions;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ViolationLog> violations;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProctorSession> proctorSessions;

    // ===== Constructors =====
    public Exam() {}

    public Exam(Long id, String title, String description, Integer totalQuestions, Boolean isScheduled,
                Integer durationMinutes, LocalDateTime startTime, LocalDateTime endTime, String universityName,
                User createdBy, List<Question> questions, List<StudentExam> studentExams,
                List<Submission> submissions, List<ViolationLog> violations, List<ProctorSession> proctorSessions) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.totalQuestions = totalQuestions;
        this.isScheduled = isScheduled;
        this.durationMinutes = durationMinutes;
        this.startTime = startTime;
        this.endTime = endTime;
        this.universityName = universityName;
        this.createdBy = createdBy;
        this.questions = questions;
        this.studentExams = studentExams;
        this.submissions = submissions;
        this.violations = violations;
        this.proctorSessions = proctorSessions;
    }

    // ===== Getters & Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Boolean getIsScheduled() { return isScheduled; }
    public void setIsScheduled(Boolean isScheduled) { this.isScheduled = isScheduled; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getUniversityName() { return universityName; }
    public void setUniversityName(String universityName) { this.universityName = universityName; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }

    public List<StudentExam> getStudentExams() { return studentExams; }
    public void setStudentExams(List<StudentExam> studentExams) { this.studentExams = studentExams; }

    public List<Submission> getSubmissions() { return submissions; }
    public void setSubmissions(List<Submission> submissions) { this.submissions = submissions; }

    public List<ViolationLog> getViolations() { return violations; }
    public void setViolations(List<ViolationLog> violations) { this.violations = violations; }

    public List<ProctorSession> getProctorSessions() { return proctorSessions; }
    public void setProctorSessions(List<ProctorSession> proctorSessions) { this.proctorSessions = proctorSessions; }

    // ===== toString =====
    @Override
    public String toString() {
        return "Exam{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", totalQuestions=" + totalQuestions +
                ", isScheduled=" + isScheduled +
                ", durationMinutes=" + durationMinutes +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", universityName='" + universityName + '\'' +
                ", createdBy=" + (createdBy != null ? createdBy.getId() : "null") +
                ", questions=" + (questions != null ? questions.size() : "null") +
                ", studentExams=" + (studentExams != null ? studentExams.size() : "null") +
                ", submissions=" + (submissions != null ? submissions.size() : "null") +
                ", violations=" + (violations != null ? violations.size() : "null") +
                ", proctorSessions=" + (proctorSessions != null ? proctorSessions.size() : "null") +
                '}';
    }
}
