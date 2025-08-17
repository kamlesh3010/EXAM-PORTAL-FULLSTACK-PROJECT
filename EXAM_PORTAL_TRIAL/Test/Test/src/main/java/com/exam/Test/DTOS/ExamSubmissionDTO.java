package com.exam.Test.DTOS;

import java.util.List;

public class ExamSubmissionDTO {

    private Long studentId;
    private Long examId;
    private List<AnswerDTO> answers;

    public ExamSubmissionDTO() {
    }

    public ExamSubmissionDTO(Long studentId, Long examId, List<AnswerDTO> answers) {
        this.studentId = studentId;
        this.examId = examId;
        this.answers = answers;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public List<AnswerDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }
}
