package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.OrderRequest;
import com.example.ecommercebackend.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse getOrderById(Long id);
    Page<OrderResponse> getAllOrders(Pageable pageable);
    Page<OrderResponse> getOrdersByUserId(Long userId, Pageable pageable);
    Page<OrderResponse> getOrdersByCorporateUserId(Long corporateUserId, Pageable pageable);
    OrderResponse updateOrderStatus(Long id, String status);
    OrderResponse updateOrder(Long id, OrderRequest request);
    void deleteOrder(Long id);
}
