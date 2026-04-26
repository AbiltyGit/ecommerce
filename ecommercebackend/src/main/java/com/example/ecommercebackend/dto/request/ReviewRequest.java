package com.example.ecommercebackend.dto.request;
public record ReviewRequest(Long productId, Long userId, Integer rating, String comment) {}
