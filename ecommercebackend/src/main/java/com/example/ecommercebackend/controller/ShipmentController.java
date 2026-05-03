package com.example.ecommercebackend.controller;
import com.example.ecommercebackend.dto.request.ShipmentRequest;
import com.example.ecommercebackend.dto.response.ShipmentResponse;
import com.example.ecommercebackend.service.ShipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CORPORATE')")
public class ShipmentController {
    private final ShipmentService shipmentService;
    public ShipmentController(ShipmentService shipmentService) { this.shipmentService = shipmentService; }
    @PostMapping
    public ResponseEntity<ShipmentResponse> createShipment(@RequestBody ShipmentRequest request) { return new ResponseEntity<>(shipmentService.createShipment(request), HttpStatus.CREATED); }
    @GetMapping("/{id}")
    public ResponseEntity<ShipmentResponse> getShipmentById(@PathVariable Long id) { return ResponseEntity.ok(shipmentService.getShipmentById(id)); }
    @GetMapping
    public ResponseEntity<List<ShipmentResponse>> getAllShipments() { return ResponseEntity.ok(shipmentService.getAllShipments()); }
}
