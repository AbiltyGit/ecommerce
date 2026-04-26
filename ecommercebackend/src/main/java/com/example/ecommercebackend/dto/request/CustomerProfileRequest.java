package com.example.ecommercebackend.dto.request;
public record CustomerProfileRequest(Long userId, String gender, Integer age, String city, String membershipType) {}
