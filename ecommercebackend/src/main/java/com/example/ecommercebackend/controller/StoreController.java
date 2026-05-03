package com.example.ecommercebackend.controller;
import com.example.ecommercebackend.dto.request.StoreRequest;
import com.example.ecommercebackend.dto.response.StoreResponse;
import com.example.ecommercebackend.service.StoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {
    private final StoreService storeService;
    public StoreController(StoreService storeService) { this.storeService = storeService; }
    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CORPORATE')")
    public ResponseEntity<StoreResponse> createStore(@RequestBody StoreRequest request) { return new ResponseEntity<>(storeService.createStore(request), HttpStatus.CREATED); }
    @GetMapping("/{id}")
    public ResponseEntity<StoreResponse> getStoreById(@PathVariable Long id) { return ResponseEntity.ok(storeService.getStoreById(id)); }
    @GetMapping
    public ResponseEntity<List<StoreResponse>> getAllStores() { return ResponseEntity.ok(storeService.getAllStores()); }
    @PatchMapping("/{id}/toggle")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoreResponse> toggleStoreStatus(@PathVariable Long id) { return ResponseEntity.ok(storeService.toggleStoreStatus(id)); }
}
