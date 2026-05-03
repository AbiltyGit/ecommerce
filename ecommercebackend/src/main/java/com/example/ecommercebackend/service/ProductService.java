package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.ProductRequest;
import com.example.ecommercebackend.dto.response.ProductResponse;
import java.util.List;
public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProducts();
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}
