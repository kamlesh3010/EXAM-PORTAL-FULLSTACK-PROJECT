package com.exam.Test.MyServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OTPService {

    private final Map<String,String> otpStorage = new HashMap<>();
    private final Map<String, LocalDateTime> otpExp = new HashMap<>();


    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOtpEmail(String email,String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("OTP For Password Reset ");
        message.setText("Your OTP is: " + otp + "\nThis OTP is valid for 5 minutes.");
        javaMailSender.send(message);
        System.out.println("OTP Email Sent to " + email + ": " + otp);
    }

    public String getOpt(String email){
        String otp =String.valueOf(new Random().nextInt(900000)+100000);
        otpStorage.put(email,otp);
        otpExp.put(email,LocalDateTime.now().plusMinutes(5));
        sendOtpEmail(email,otp);
        return otp;
    }


    public boolean verifyOtp(String email,String otp){
        if (! otpStorage.containsKey(email)){
            return false;
        }
        if (otpExp.get(email).isBefore(LocalDateTime.now())) return false;
        return otpStorage.get(email).equals(otp);
    }
}
