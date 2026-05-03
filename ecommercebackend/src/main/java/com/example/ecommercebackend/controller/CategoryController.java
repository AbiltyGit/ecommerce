package com.example.ecommercebackend.controller;
import com.example.ecommercebackend.dto.request.CategoryRequest;
import com.example.ecommercebackend.dto.response.CategoryResponse;
import com.example.ecommercebackend.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService) { this.categoryService = categoryService; }
    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryRequest request) { return new ResponseEntity<>(categoryService.createCategory(request), HttpStatus.CREATED); }
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) { return ResponseEntity.ok(categoryService.getCategoryById(id)); }
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() { return ResponseEntity.ok(categoryService.getAllCategories()); }
}
