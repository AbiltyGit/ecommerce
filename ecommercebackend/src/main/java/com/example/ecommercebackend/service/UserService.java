package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.UserRequest;
import com.example.ecommercebackend.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    Page<UserResponse> getAllUsers(Pageable pageable);
    Page<UserResponse> searchUsers(String query, String role, Pageable pageable);
    void deleteUser(Long id);
}
