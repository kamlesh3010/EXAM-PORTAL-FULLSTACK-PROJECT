package com.exam.Test.DTOS;

public class AnswerDTO {

    private Long questionId;
    private Long selectedOptionId;
    private Long studentId; //

    public AnswerDTO() {
    }

    public AnswerDTO(Long questionId, Long selectedOptionId, Long studentId) {
        this.questionId = questionId;
        this.selectedOptionId = selectedOptionId;
        this.studentId = studentId;
    }

    public Long getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(Long selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}
