package com.example.ecommercebackend.dto.response;
import com.example.ecommercebackend.model.enums.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(Long id, Long userId, String username, @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime orderDate, OrderStatus status, String paymentMethod, String trackingNumber, List<OrderItemResponse> items) {}
