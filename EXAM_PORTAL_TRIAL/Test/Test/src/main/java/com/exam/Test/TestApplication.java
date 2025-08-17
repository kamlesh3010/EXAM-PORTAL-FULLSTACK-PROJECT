package com.exam.Test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TestApplication {

	public static void main(String[] args) {
		System.out.println("🚀 Starting our amazing Spring Boot Application... Please wait! 🌟");
		SpringApplication.run(TestApplication.class, args);
		System.out.println("✅ Spring Boot Application is UP and Running! Enjoy! 🎉");
	}
}
