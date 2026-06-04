package com.example.ecommercebackend.repository;

import com.example.ecommercebackend.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
    List<Review> findByUserId(Long userId);
    Page<Review> findByProductStoreCorporateUserId(Long corporateUserId, Pageable pageable);
}
