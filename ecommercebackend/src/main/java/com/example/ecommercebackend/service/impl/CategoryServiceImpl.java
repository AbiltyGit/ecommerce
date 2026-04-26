package com.example.ecommercebackend.service.impl;
import com.example.ecommercebackend.dto.request.CategoryRequest;
import com.example.ecommercebackend.dto.response.CategoryResponse;
import com.example.ecommercebackend.model.Category;
import com.example.ecommercebackend.repository.CategoryRepository;
import com.example.ecommercebackend.service.CategoryService;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    public CategoryServiceImpl(CategoryRepository categoryRepository) { this.categoryRepository = categoryRepository; }
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.name());
        if (request.parentCategoryId() != null) {
            Category parent = categoryRepository.findById(request.parentCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParentCategory(parent);
        }
        return mapToResponse(categoryRepository.save(category));
    }
    public CategoryResponse getCategoryById(Long id) { return mapToResponse(categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"))); }
    public List<CategoryResponse> getAllCategories() { return categoryRepository.findAll().stream().map(this::mapToResponse).toList(); }
    private CategoryResponse mapToResponse(Category category) { return new CategoryResponse(category.getId(), category.getName(), category.getParentCategory() != null ? category.getParentCategory().getId() : null); }
}
