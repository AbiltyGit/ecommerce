package com.example.ecommercebackend.service.impl;
import com.example.ecommercebackend.dto.request.ProductRequest;
import com.example.ecommercebackend.dto.response.ProductResponse;
import com.example.ecommercebackend.model.Product;
import com.example.ecommercebackend.model.Store;
import com.example.ecommercebackend.model.Category;
import com.example.ecommercebackend.repository.ProductRepository;
import com.example.ecommercebackend.repository.StoreRepository;
import com.example.ecommercebackend.repository.CategoryRepository;
import com.example.ecommercebackend.service.ProductService;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, StoreRepository storeRepository, CategoryRepository categoryRepository) { 
        this.productRepository = productRepository; 
        this.storeRepository = storeRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setSku(request.sku());
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStockQuantity(request.stockQuantity());
        
        if (request.storeId() != null) {
            Store store = storeRepository.findById(request.storeId()).orElseThrow(() -> new ResourceNotFoundException("Store not found"));
            product.setStore(store);
        }
        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        
        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }
    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        return mapToResponse(product);
    }
    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::mapToResponse).toList();
    }
    private ProductResponse mapToResponse(Product product) {
        Long storeId = product.getStore() != null ? product.getStore().getId() : null;
        Long catId = product.getCategory() != null ? product.getCategory().getId() : null;
        return new ProductResponse(product.getId(), product.getSku(), product.getName(), product.getDescription(), product.getPrice(), product.getStockQuantity(), storeId, catId);
    }
}
