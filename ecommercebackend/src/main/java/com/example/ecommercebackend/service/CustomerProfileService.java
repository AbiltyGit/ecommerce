package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.CustomerProfileRequest;
import com.example.ecommercebackend.dto.response.CustomerProfileResponse;
import java.util.List;
public interface CustomerProfileService {
    CustomerProfileResponse createProfile(CustomerProfileRequest request);
    CustomerProfileResponse getProfileById(Long id);
    CustomerProfileResponse getProfileByUserId(Long userId);
    CustomerProfileResponse updateProfileByUserId(Long userId, CustomerProfileRequest request);
    List<CustomerProfileResponse> getAllProfiles();
}
