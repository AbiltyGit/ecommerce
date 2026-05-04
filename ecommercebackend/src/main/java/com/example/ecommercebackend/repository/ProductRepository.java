package com.example.ecommercebackend.repository;

import com.example.ecommercebackend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStoreId(Long storeId);
    List<Product> findByCategoryId(Long categoryId);

    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryId = -1L OR p.category.id = :categoryId) AND " +
           "(:search = '' OR LOWER(p.name) LIKE LOWER(:search) OR LOWER(p.description) LIKE LOWER(:search))")
    Page<Product> findWithFilters(@Param("categoryId") Long categoryId, @Param("search") String search, Pageable pageable);
}
