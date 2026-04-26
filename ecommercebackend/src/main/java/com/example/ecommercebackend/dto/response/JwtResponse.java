package com.example.ecommercebackend.dto.response;
import java.util.List;
public record JwtResponse(String token, String refreshToken, Long id, String username, String email, List<String> roles) {}
