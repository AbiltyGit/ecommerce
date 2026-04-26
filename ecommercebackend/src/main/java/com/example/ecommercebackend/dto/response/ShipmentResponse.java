package com.example.ecommercebackend.dto.response;
import java.time.LocalDateTime;
public record ShipmentResponse(Long id, Long orderId, String warehouseBlock, String modeOfShipment, String trackingNumber, LocalDateTime shippedDate) {}
