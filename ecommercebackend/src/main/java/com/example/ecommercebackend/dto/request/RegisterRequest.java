package com.example.ecommercebackend.dto.request;
import com.example.ecommercebackend.model.enums.UserRole;
public record RegisterRequest(String username, String email, String password, UserRole role) {}
