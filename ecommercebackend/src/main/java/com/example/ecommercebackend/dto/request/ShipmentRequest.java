package com.example.ecommercebackend.dto.request;
public record ShipmentRequest(Long orderId, String warehouseBlock, String modeOfShipment, String trackingNumber) {}
