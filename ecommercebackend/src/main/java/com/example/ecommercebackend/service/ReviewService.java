package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.ReviewRequest;
import com.example.ecommercebackend.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
public interface ReviewService {
    ReviewResponse createReview(ReviewRequest request);
    ReviewResponse getReviewById(Long id);
    List<ReviewResponse> getAllReviews();
    Page<ReviewResponse> getAllReviews(Pageable pageable);
    Page<ReviewResponse> getReviewsByCorporateUserId(Long corporateUserId, Pageable pageable);
    ReviewResponse updateReviewStatus(Long id, com.example.ecommercebackend.model.enums.ReviewStatus status);
    ReviewResponse respondToReview(Long id, String response);
}
