package com.example.ecommercebackend.service.impl;
import com.example.ecommercebackend.dto.request.CustomerProfileRequest;
import com.example.ecommercebackend.dto.response.CustomerProfileResponse;
import com.example.ecommercebackend.model.CustomerProfile;
import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.repository.CustomerProfileRepository;
import com.example.ecommercebackend.repository.UserRepository;
import com.example.ecommercebackend.service.CustomerProfileService;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.math.BigDecimal;
@Service
public class CustomerProfileServiceImpl implements CustomerProfileService {
    private final CustomerProfileRepository profileRepository;
    private final UserRepository userRepository;
    public CustomerProfileServiceImpl(CustomerProfileRepository profileRepository, UserRepository userRepository) { this.profileRepository = profileRepository; this.userRepository = userRepository; }
    public CustomerProfileResponse createProfile(CustomerProfileRequest request) {
        CustomerProfile profile = new CustomerProfile();
        profile.setGender(request.gender());
        profile.setAge(request.age());
        profile.setCity(request.city());
        profile.setMembershipType(request.membershipType());
        profile.setTotalSpend(BigDecimal.ZERO);
        profile.setItemsPurchased(0);
        profile.setAvgRating(0.0);
        profile.setDiscountApplied(false);
        profile.setSatisfactionLevel(0);
        if (request.userId() != null) {
            User user = userRepository.findById(request.userId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            profile.setUser(user);
        }
        return mapToResponse(profileRepository.save(profile));
    }
    public CustomerProfileResponse getProfileById(Long id) { return mapToResponse(profileRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profile not found"))); }
    
    public CustomerProfileResponse getProfileByUserId(Long userId) {
        CustomerProfile profile = profileRepository.findByUserId(userId)
            .orElseGet(() -> {
                // If doesn't exist, create an empty profile
                CustomerProfile newProfile = new CustomerProfile();
                User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
                newProfile.setUser(user);
                newProfile.setTotalSpend(BigDecimal.ZERO);
                newProfile.setItemsPurchased(0);
                newProfile.setAvgRating(0.0);
                return profileRepository.save(newProfile);
            });
        return mapToResponse(profile);
    }

    public CustomerProfileResponse updateProfileByUserId(Long userId, CustomerProfileRequest request) {
        CustomerProfile profile = profileRepository.findByUserId(userId)
            .orElseGet(() -> {
                CustomerProfile newProfile = new CustomerProfile();
                User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
                newProfile.setUser(user);
                return newProfile;
            });
        
        if (request.gender() != null) profile.setGender(request.gender());
        if (request.age() != null) profile.setAge(request.age());
        if (request.city() != null) profile.setCity(request.city());
        if (request.membershipType() != null) profile.setMembershipType(request.membershipType());
        
        return mapToResponse(profileRepository.save(profile));
    }

    public List<CustomerProfileResponse> getAllProfiles() { return profileRepository.findAll().stream().map(this::mapToResponse).toList(); }
    private CustomerProfileResponse mapToResponse(CustomerProfile profile) { return new CustomerProfileResponse(profile.getId(), profile.getUser() != null ? profile.getUser().getId() : null, profile.getGender(), profile.getAge(), profile.getCity(), profile.getMembershipType(), profile.getTotalSpend(), profile.getItemsPurchased(), profile.getAvgRating(), profile.getDiscountApplied(), profile.getSatisfactionLevel()); }
}
