package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.ShipmentRequest;
import com.example.ecommercebackend.dto.response.ShipmentResponse;
import java.util.List;
public interface ShipmentService {
    ShipmentResponse createShipment(ShipmentRequest request);
    ShipmentResponse getShipmentById(Long id);
    List<ShipmentResponse> getAllShipments();
}
