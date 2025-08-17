package com.exam.Test.DTOS;

import java.time.Duration;
import java.time.LocalDateTime;

public class ResultDTO {

    private String studentName;
    private String examTitle;

    public ResultDTO() {
    }

    private int totalQuestions;
    private int correctAnswers;

    public ResultDTO(String studentName, String examTitle, int totalQuestions, int correctAnswers, double percentage, String grade, Duration timeTaken) {
        this.studentName = studentName;
        this.examTitle = examTitle;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.percentage = percentage;
        this.grade = grade;
        this.timeTaken = timeTaken;
    }

    private double percentage;
    private String grade;
    private Duration timeTaken;

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Duration getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(Duration timeTaken) {
        this.timeTaken = timeTaken;
    }
}
