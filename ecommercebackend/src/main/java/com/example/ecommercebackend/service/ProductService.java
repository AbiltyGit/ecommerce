package com.example.ecommercebackend.service;

import com.example.ecommercebackend.dto.request.ProductRequest;
import com.example.ecommercebackend.dto.response.ProductResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProducts();
    Page<ProductResponse> getProducts(int page, int size, String search, Long categoryId, String sortBy);
    List<ProductResponse> getProductsByStoreId(Long storeId);
    List<ProductResponse> getProductsByCorporateUserId(Long corporateUserId);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}
