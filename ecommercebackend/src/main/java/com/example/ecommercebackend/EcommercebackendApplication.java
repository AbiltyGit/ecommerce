package com.example.ecommercebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport; // EKLENDİ

@SpringBootApplication
// Aşağıdaki satır eklendi. Spring Data'nın sayfalama sonuçlarını doğrudan DTO (JSON) formatına çevirmesini sağlar.
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class EcommercebackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommercebackendApplication.class, args);
	}

}
