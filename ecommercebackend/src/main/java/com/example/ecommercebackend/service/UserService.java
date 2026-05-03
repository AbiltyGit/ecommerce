package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.UserRequest;
import com.example.ecommercebackend.dto.response.UserResponse;
import java.util.List;
public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    void deleteUser(Long id);
}
