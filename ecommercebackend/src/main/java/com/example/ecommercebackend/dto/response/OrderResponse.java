package com.example.ecommercebackend.dto.response;
import com.example.ecommercebackend.model.enums.OrderStatus;
import java.time.LocalDateTime;
public record OrderResponse(Long id, Long userId, LocalDateTime orderDate, OrderStatus status, String paymentMethod) {}
