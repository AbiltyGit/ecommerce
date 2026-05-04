package com.example.ecommercebackend.dto.request;
import java.util.List;

public record OrderRequest(
    Long userId, 
    String paymentMethod, 
    String shippingAddress, 
    String billingAddress, 
    List<OrderItemRequest> items
) {}