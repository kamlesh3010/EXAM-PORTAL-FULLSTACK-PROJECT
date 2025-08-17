package com.exam.Test.DTOS.SignalDTOS;

public class SdpOfferDTO {
    private String studentId;
    private String type; // "offer"
    private String sdp;

    public SdpOfferDTO() {}
    public SdpOfferDTO(String studentId, String type, String sdp) {
        this.studentId = studentId;
        this.type = type;
        this.sdp = sdp;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSdp() { return sdp; }
    public void setSdp(String sdp) { this.sdp = sdp; }
}
