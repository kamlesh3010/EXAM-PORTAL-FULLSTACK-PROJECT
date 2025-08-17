package com.exam.Test.DTOS.SignalDTOS;


public class ProctorActionDTO {
    private String studentId;

    public ProctorActionDTO(String studentId, String action) {
        this.studentId = studentId;
        this.action = action;
    }

    public ProctorActionDTO() {
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    private String action; // "warn" | "pause" | "resume" | "end"
}

