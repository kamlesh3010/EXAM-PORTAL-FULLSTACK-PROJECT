package com.exam.Test.DTOS;

import java.util.List;

public class QuestionDTO {

    private Long id; // question id
    private Long examId; // ✅ new field
    private String questionText;
    private List<OptionDTO> options;

    public QuestionDTO() {
    }

    public QuestionDTO(Long id, Long examId, String questionText, List<OptionDTO> options) {
        this.id = id;
        this.examId = examId;
        this.questionText = questionText;
        this.options = options;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<OptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<OptionDTO> options) {
        this.options = options;
    }
}
