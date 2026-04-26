package com.example.ecommercebackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments", indexes = { @Index(name = "idx_shipment_tracking", columnList = "tracking_number") })
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    private String warehouseBlock;
    private String modeOfShipment;
    private String trackingNumber;
    
    @Column(name = "shipped_date")
    private LocalDateTime shippedDate;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    
    public String getWarehouseBlock() { return warehouseBlock; }
    public void setWarehouseBlock(String warehouseBlock) { this.warehouseBlock = warehouseBlock; }
    
    public String getModeOfShipment() { return modeOfShipment; }
    public void setModeOfShipment(String modeOfShipment) { this.modeOfShipment = modeOfShipment; }
    
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    
    public LocalDateTime getShippedDate() { return shippedDate; }
    public void setShippedDate(LocalDateTime shippedDate) { this.shippedDate = shippedDate; }
}
