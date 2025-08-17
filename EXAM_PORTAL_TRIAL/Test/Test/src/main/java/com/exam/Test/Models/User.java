package com.exam.Test.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@JsonIgnoreProperties(ignoreUnknown = true) // ✅ Ignore any unrecognized fields during deserialization
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String universityName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ✅ Prevent Jackson from deserializing these during login
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    private List<Exam> examsCreated;

    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<StudentExam> studentExams;

    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Submission> submissions;

    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<ViolationLog> violations;

    @JsonIgnore
    @OneToMany(mappedBy = "proctor", cascade = CascadeType.ALL)
    private List<ProctorSession> proctorSessions;

    // Constructors
    public User() {}

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User(Long id, String name, String email, String password, Role role, String universityName,
                LocalDateTime createdAt, List<Exam> examsCreated, List<StudentExam> studentExams,
                List<Submission> submissions, List<ViolationLog> violations, List<ProctorSession> proctorSessions) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.universityName = universityName;
        this.createdAt = createdAt;
        this.examsCreated = examsCreated;
        this.studentExams = studentExams;
        this.submissions = submissions;
        this.violations = violations;
        this.proctorSessions = proctorSessions;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getUniversityName() { return universityName; }
    public void setUniversityName(String universityName) { this.universityName = universityName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Exam> getExamsCreated() { return examsCreated; }
    public void setExamsCreated(List<Exam> examsCreated) { this.examsCreated = examsCreated; }

    public List<StudentExam> getStudentExams() { return studentExams; }
    public void setStudentExams(List<StudentExam> studentExams) { this.studentExams = studentExams; }

    public List<Submission> getSubmissions() { return submissions; }
    public void setSubmissions(List<Submission> submissions) { this.submissions = submissions; }

    public List<ViolationLog> getViolations() { return violations; }
    public void setViolations(List<ViolationLog> violations) { this.violations = violations; }

    public List<ProctorSession> getProctorSessions() { return proctorSessions; }
    public void setProctorSessions(List<ProctorSession> proctorSessions) { this.proctorSessions = proctorSessions; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", universityName='" + universityName + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
