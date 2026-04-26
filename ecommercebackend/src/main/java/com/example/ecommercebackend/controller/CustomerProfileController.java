package com.example.ecommercebackend.controller;
import com.example.ecommercebackend.dto.request.CustomerProfileRequest;
import com.example.ecommercebackend.dto.response.CustomerProfileResponse;
import com.example.ecommercebackend.service.CustomerProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class CustomerProfileController {
    private final CustomerProfileService profileService;
    public CustomerProfileController(CustomerProfileService profileService) { this.profileService = profileService; }
    @PostMapping
    public ResponseEntity<CustomerProfileResponse> createProfile(@RequestBody CustomerProfileRequest request) { return new ResponseEntity<>(profileService.createProfile(request), HttpStatus.CREATED); }
    @GetMapping("/{id}")
    public ResponseEntity<CustomerProfileResponse> getProfileById(@PathVariable Long id) { return ResponseEntity.ok(profileService.getProfileById(id)); }
    @GetMapping
    public ResponseEntity<List<CustomerProfileResponse>> getAllProfiles() { return ResponseEntity.ok(profileService.getAllProfiles()); }
}
