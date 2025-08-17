package com.exam.Test.DTOS.SignalDTOS;
import lombok.*;

@Data
public class OfferDTO {
    private String studentId;

    public String getSdp() {
        return sdp;
    }

    public void setSdp(String sdp) {
        this.sdp = sdp;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    private String sdp;
}

