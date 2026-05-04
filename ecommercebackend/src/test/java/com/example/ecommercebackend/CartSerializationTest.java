package com.example.ecommercebackend;

import com.example.ecommercebackend.model.Cart;
import com.example.ecommercebackend.model.CartItem;
import com.example.ecommercebackend.model.Product;
import com.example.ecommercebackend.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

public class CartSerializationTest {

    @Test
    public void testSerialization() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        
        Cart cart = new Cart();
        cart.setId(1L);
        
        User user = new User();
        user.setId(1L);
        cart.setUser(user);
        
        Product product = new Product();
        product.setId(10L);
        product.setName("Test Product");
        
        CartItem item = new CartItem();
        item.setId(100L);
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(2);
        
        cart.setItems(List.of(item));
        
        String json = mapper.writeValueAsString(cart);
        System.out.println(json);
    }
}
