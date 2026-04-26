package com.example.ecommercebackend.dto.request;
import java.util.List;
public record OrderRequest(Long userId, String paymentMethod, List<OrderItemRequest> items) {}
