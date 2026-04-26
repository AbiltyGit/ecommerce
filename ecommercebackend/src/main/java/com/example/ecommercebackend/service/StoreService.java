package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.StoreRequest;
import com.example.ecommercebackend.dto.response.StoreResponse;
import java.util.List;
public interface StoreService {
    StoreResponse createStore(StoreRequest request);
    StoreResponse getStoreById(Long id);
    List<StoreResponse> getAllStores();
}
