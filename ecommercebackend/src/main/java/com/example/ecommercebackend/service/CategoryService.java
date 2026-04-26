package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.CategoryRequest;
import com.example.ecommercebackend.dto.response.CategoryResponse;
import java.util.List;
public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse getCategoryById(Long id);
    List<CategoryResponse> getAllCategories();
}
