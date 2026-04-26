package com.example.ecommercebackend.service.impl;
import com.example.ecommercebackend.dto.request.ShipmentRequest;
import com.example.ecommercebackend.dto.response.ShipmentResponse;
import com.example.ecommercebackend.model.Shipment;
import com.example.ecommercebackend.model.Order;
import com.example.ecommercebackend.repository.ShipmentRepository;
import com.example.ecommercebackend.repository.OrderRepository;
import com.example.ecommercebackend.service.ShipmentService;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;
@Service
public class ShipmentServiceImpl implements ShipmentService {
    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;
    public ShipmentServiceImpl(ShipmentRepository shipmentRepository, OrderRepository orderRepository) { this.shipmentRepository = shipmentRepository; this.orderRepository = orderRepository; }
    public ShipmentResponse createShipment(ShipmentRequest request) {
        Shipment shipment = new Shipment();
        shipment.setWarehouseBlock(request.warehouseBlock());
        shipment.setModeOfShipment(request.modeOfShipment());
        shipment.setTrackingNumber(request.trackingNumber());
        shipment.setShippedDate(LocalDateTime.now());
        if (request.orderId() != null) {
            Order order = orderRepository.findById(request.orderId()).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
            shipment.setOrder(order);
        }
        return mapToResponse(shipmentRepository.save(shipment));
    }
    public ShipmentResponse getShipmentById(Long id) { return mapToResponse(shipmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Shipment not found"))); }
    public List<ShipmentResponse> getAllShipments() { return shipmentRepository.findAll().stream().map(this::mapToResponse).toList(); }
    private ShipmentResponse mapToResponse(Shipment shipment) { return new ShipmentResponse(shipment.getId(), shipment.getOrder() != null ? shipment.getOrder().getId() : null, shipment.getWarehouseBlock(), shipment.getModeOfShipment(), shipment.getTrackingNumber(), shipment.getShippedDate()); }
}
