package com.exam.Test.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String answer;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "student_exam_id")
    private StudentExam studentExam;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    private Boolean isCorrect;

    private LocalDateTime submittedAt;

    // Getters and Setters (since you’re not using Lombok)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public StudentExam getStudentExam() { return studentExam; }
    public void setStudentExam(StudentExam studentExam) { this.studentExam = studentExam; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Exam getExam() { return exam; }
    public void setExam(Exam exam) { this.exam = exam; }

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
