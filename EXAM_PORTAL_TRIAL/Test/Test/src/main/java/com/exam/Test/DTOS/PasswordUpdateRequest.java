package com.exam.Test.DTOS;

public class PasswordUpdateRequest {
    private String email;
    private String NesPassword;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNesPassword() {
        return NesPassword;
    }

    public void setNesPassword(String nesPassword) {
        NesPassword = nesPassword;
    }
}
