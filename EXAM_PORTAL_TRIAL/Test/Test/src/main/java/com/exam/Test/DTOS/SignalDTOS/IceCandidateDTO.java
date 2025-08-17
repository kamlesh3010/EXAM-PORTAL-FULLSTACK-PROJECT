package com.exam.Test.DTOS.SignalDTOS;

import lombok.Data;

@Data
public class IceCandidateDTO {
    public String getStudentId() {
        return studentId;
    }

    public IceCandidateDTO(String studentId, Object candidate, boolean fromProctor) {
        this.studentId = studentId;
        this.candidate = candidate;
        this.fromProctor = fromProctor;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Object getCandidate() {
        return candidate;
    }

    public void setCandidate(Object candidate) {
        this.candidate = candidate;
    }

    public boolean isFromProctor() {
        return fromProctor;
    }

    public void setFromProctor(boolean fromProctor) {
        this.fromProctor = fromProctor;
    }

    private String studentId;
    private Object candidate;   // keep as Object to pass JSON straight-through
    private boolean fromProctor;
}