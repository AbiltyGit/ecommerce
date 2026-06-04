package com.example.ecommercebackend.service.impl;
import com.example.ecommercebackend.dto.request.UserRequest;
import com.example.ecommercebackend.dto.response.UserResponse;
import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.repository.UserRepository;
import com.example.ecommercebackend.service.UserService;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    public UserServiceImpl(UserRepository userRepository) { this.userRepository = userRepository; }
    
    @Override
    public UserResponse createUser(UserRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setRole(request.role());
        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }
    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return mapToResponse(user);
    }
    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToResponse).toList();
    }
    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }
    @Override
    public Page<UserResponse> searchUsers(String query, String role, Pageable pageable) {
        com.example.ecommercebackend.model.enums.UserRole roleEnum = null;
        if (role != null && !role.isEmpty() && !role.equalsIgnoreCase("ALL")) {
            roleEnum = com.example.ecommercebackend.model.enums.UserRole.valueOf(role.toUpperCase());
        }
        String searchQuery = (query == null || query.isEmpty()) ? null : query;
        return userRepository.findByFilters(searchQuery, roleEnum, pageable).map(this::mapToResponse);
    }
    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        userRepository.delete(user);
    }
    private UserResponse mapToResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}
