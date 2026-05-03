package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.OrderRequest;
import com.example.ecommercebackend.dto.response.OrderResponse;
import java.util.List;
public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse getOrderById(Long id);
    List<OrderResponse> getAllOrders();
    List<OrderResponse> getOrdersByUserId(Long userId);
    List<OrderResponse> getOrdersByCorporateUserId(Long corporateUserId);
    OrderResponse updateOrderStatus(Long id, String status);
    OrderResponse updateOrder(Long id, OrderRequest request);
    void deleteOrder(Long id);
}
