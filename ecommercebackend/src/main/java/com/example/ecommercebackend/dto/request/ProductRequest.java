package com.example.ecommercebackend.dto.request;
import java.math.BigDecimal;
public record ProductRequest(String sku, String name, String description, BigDecimal price, Integer stockQuantity, Long storeId, Long categoryId) {}
