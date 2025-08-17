package com.exam.Test.Models;

import jakarta.persistence.*;

@Entity
public class StudentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User student;

    @ManyToOne
    private Exam exam;

    @ManyToOne
    private Question question;

    @ManyToOne
    private ExamOption selectedOption;

    private boolean correct;

    // Constructors
    public StudentAnswer() {}

    public StudentAnswer(User student, Exam exam, Question question, ExamOption selectedOption, boolean correct) {
        this.student = student;
        this.exam = exam;
        this.question = question;
        this.selectedOption = selectedOption;
        this.correct = correct;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public ExamOption getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(ExamOption selectedOption) {
        this.selectedOption = selectedOption;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }
}
