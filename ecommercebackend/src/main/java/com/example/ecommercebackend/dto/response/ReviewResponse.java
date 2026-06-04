package com.example.ecommercebackend.dto.response;
import com.example.ecommercebackend.model.enums.ReviewStatus;
import java.time.LocalDateTime;
public record ReviewResponse(Long id, Long productId, Long userId, Integer rating, String comment, String response, Integer helpfulVotes, Integer totalVotes, ReviewStatus status, LocalDateTime createdAt) {}
