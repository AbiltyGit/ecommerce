package com.example.ecommercebackend.service;

import com.example.ecommercebackend.dto.response.CartResponse;

public interface CartService {
    CartResponse getCartByUserId(Long userId);
    CartResponse addToCart(Long userId, Long productId, Integer quantity);
    CartResponse removeFromCart(Long userId, Long cartItemId);
    void clearCart(Long userId);
}