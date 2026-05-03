package com.example.ecommercebackend.service;
import com.example.ecommercebackend.model.Cart;
public interface CartService {
    Cart getCartByUserId(Long userId);
    Cart addToCart(Long userId, Long productId, Integer quantity);
    Cart removeFromCart(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
