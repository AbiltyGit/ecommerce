package com.example.ecommercebackend.dto.response;
import java.math.BigDecimal;
public record CustomerProfileResponse(Long id, Long userId, String gender, Integer age, String city, String membershipType, BigDecimal totalSpend, Integer itemsPurchased, Double avgRating, Boolean discountApplied, Integer satisfactionLevel) {}
