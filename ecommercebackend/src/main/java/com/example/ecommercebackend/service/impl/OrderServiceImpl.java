package com.example.ecommercebackend.service.impl;
import com.example.ecommercebackend.dto.request.OrderRequest;
import com.example.ecommercebackend.dto.request.OrderItemRequest;
import com.example.ecommercebackend.dto.response.OrderItemResponse;
import com.example.ecommercebackend.dto.response.OrderResponse;
import com.example.ecommercebackend.model.Order;
import com.example.ecommercebackend.model.OrderItem;
import com.example.ecommercebackend.model.Product;
import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.model.enums.OrderStatus;
import com.example.ecommercebackend.repository.OrderRepository;
import com.example.ecommercebackend.repository.UserRepository;
import com.example.ecommercebackend.repository.ProductRepository;
import com.example.ecommercebackend.service.OrderService;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import com.example.ecommercebackend.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.ArrayList;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository) { 
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User user = userRepository.findById(request.userId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Order order = new Order();
        order.setUser(user);
        order.setPaymentMethod(request.paymentMethod());
        order.setStatus(OrderStatus.PENDING);
        
        List<OrderItem> items = new ArrayList<>();
        for(OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            if(product.getStockQuantity() < itemReq.quantity()) {
                throw new BadRequestException("Not enough stock for product: " + product.getName());
            }
            
            product.setStockQuantity(product.getStockQuantity() - itemReq.quantity());
            productRepository.save(product);
            
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.quantity());
            item.setUnitPrice(product.getPrice());
            items.add(item);
        }
        order.setItems(items);
        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }
    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToResponse(order);
    }
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByCorporateUserId(Long corporateUserId) {
        return orderRepository.findOrdersByCorporateUserId(corporateUserId).stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        order.setStatus(com.example.ecommercebackend.model.enums.OrderStatus.valueOf(status));
        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        if (order.getItems() != null) {
            itemResponses = order.getItems().stream()
                .map(i -> new OrderItemResponse(i.getId(), i.getProduct().getId(), i.getProduct().getName(), i.getQuantity(), i.getUnitPrice()))
                .toList();
        }
        return new OrderResponse(order.getId(), order.getUser().getId(), order.getUser().getUsername(), order.getOrderDate(), order.getStatus(), order.getPaymentMethod(), itemResponses);
    }

    @Override
    @Transactional
    public OrderResponse updateOrder(Long id, OrderRequest request) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        order.setPaymentMethod(request.paymentMethod());
        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        orderRepository.delete(order);
    }
}
