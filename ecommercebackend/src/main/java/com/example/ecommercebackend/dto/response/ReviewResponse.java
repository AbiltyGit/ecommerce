package com.example.ecommercebackend.dto.response;
import java.time.LocalDateTime;
public record ReviewResponse(Long id, Long productId, Long userId, Integer rating, String comment, Integer helpfulVotes, Integer totalVotes, LocalDateTime createdAt) {}
