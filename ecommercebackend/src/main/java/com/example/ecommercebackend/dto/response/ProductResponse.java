package com.example.ecommercebackend.dto.response;
import java.math.BigDecimal;
public record ProductResponse(Long id, String sku, String name, String description, BigDecimal price, Integer stockQuantity, Long storeId, Long categoryId) {}
