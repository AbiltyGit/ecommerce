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
import com.example.ecommercebackend.exception.BadRequestException;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.example.ecommercebackend.security.CustomUserDetails;
import com.example.ecommercebackend.model.enums.UserRole;

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
        
        // Security Context üzerinden aktif kullanıcıyı al
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        
        if (userDetails.getUser().getRole() == UserRole.CORPORATE) {
            // Corporate ise storeId'yi zorla kendi mağazasına ayarla
            List<Store> corporateStores = storeRepository.findByCorporateUserId(userDetails.getUser().getId());
            if (corporateStores.isEmpty()) {
                throw new BadRequestException("Corporate user does not have an active store.");
            }
            product.setStore(corporateStores.get(0));
        } else if (request.storeId() != null) {
            // Admin ise istediği store'a ekleyebilir
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

    @Override
    public org.springframework.data.domain.Page<ProductResponse> getProducts(int page, int size, String search, Long categoryId, String sortBy) {
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"); // newest
        if ("price_asc".equals(sortBy)) {
            sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "price");
        } else if ("price_desc".equals(sortBy)) {
            sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "price");
        }
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, sort);
        String searchQuery = (search != null && !search.trim().isEmpty()) ? "%" + search.trim() + "%" : "";
        Long catId = (categoryId != null) ? categoryId : -1L;
        return productRepository.findWithFilters(catId, searchQuery, pageable).map(this::mapToResponse);
    }

    @Override
    public List<ProductResponse> getProductsByStoreId(Long storeId) {
        return productRepository.findByStoreId(storeId).stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<ProductResponse> getProductsByCorporateUserId(Long corporateUserId) {
        List<Store> stores = storeRepository.findByCorporateUserId(corporateUserId);
        List<ProductResponse> responses = new ArrayList<>();
        for(Store store : stores) {
            responses.addAll(productRepository.findByStoreId(store.getId()).stream().map(this::mapToResponse).toList());
        }
        return responses;
    }
    private ProductResponse mapToResponse(Product product) {
        Long storeId = product.getStore() != null ? product.getStore().getId() : null;
        Long catId = product.getCategory() != null ? product.getCategory().getId() : null;
        return new ProductResponse(product.getId(), product.getSku(), product.getName(), product.getDescription(), product.getPrice(), product.getStockQuantity(), storeId, catId);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
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
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        productRepository.delete(product);
    }
}
