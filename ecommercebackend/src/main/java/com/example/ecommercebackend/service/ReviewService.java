package com.example.ecommercebackend.service;
import com.example.ecommercebackend.dto.request.ReviewRequest;
import com.example.ecommercebackend.dto.response.ReviewResponse;
import java.util.List;
public interface ReviewService {
    ReviewResponse createReview(ReviewRequest request);
    ReviewResponse getReviewById(Long id);
    List<ReviewResponse> getAllReviews();
}
