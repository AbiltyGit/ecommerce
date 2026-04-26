package com.example.ecommercebackend.dto.response;
import com.example.ecommercebackend.model.enums.UserRole;
import java.time.LocalDateTime;
public record UserResponse(Long id, String username, String email, UserRole role, LocalDateTime createdAt) {}
