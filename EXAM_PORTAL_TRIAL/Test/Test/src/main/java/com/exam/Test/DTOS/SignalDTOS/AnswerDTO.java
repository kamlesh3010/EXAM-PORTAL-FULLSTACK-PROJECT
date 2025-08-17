package com.exam.Test.DTOS.SignalDTOS;

import lombok.Data;

@Data
public class AnswerDTO {
    public AnswerDTO(String studentId, String sdp) {
        this.studentId = studentId;
        this.sdp = sdp;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getSdp() {
        return sdp;
    }

    public void setSdp(String sdp) {
        this.sdp = sdp;
    }

    private String studentId;
    private String sdp;
}
