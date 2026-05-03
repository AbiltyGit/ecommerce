package com.example.ecommercebackend.dto.response;

public record OrderItemResponse(Long id, Long productId, String productName, Integer quantity, java.math.BigDecimal unitPrice) {}
