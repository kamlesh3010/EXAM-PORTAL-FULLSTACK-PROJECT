package com.exam.Test.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    @JsonBackReference // prevents circular reference
    private Exam exam;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference // helps serialize child options
    private List<ExamOption> options = new ArrayList<>();

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "correct_option_id")
    @JsonIgnoreProperties({"question", "exam"}) // avoid cyclic issue from correctOption
    private ExamOption correctOption;

    // Constructors
    public Question() {}

    public Question(Long id, Exam exam, String questionText, List<ExamOption> options, ExamOption correctOption) {
        this.id = id;
        this.exam = exam;
        this.questionText = questionText;
        this.options = options;
        this.correctOption = correctOption;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public Exam getExam() { return exam; }
    public void setExam(Exam exam) { this.exam = exam; }

    public List<ExamOption> getOptions() { return options; }
    public void setOptions(List<ExamOption> options) { this.options = options; }

    public ExamOption getCorrectOption() { return correctOption; }
    public void setCorrectOption(ExamOption correctOption) { this.correctOption = correctOption; }

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", questionText='" + questionText + '\'' +
                ", correctOption=" + (correctOption != null ? correctOption.getOptionText() : "N/A") +
                '}';
    }
}
