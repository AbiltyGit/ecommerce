package com.example.ecommercebackend.service.impl;
import com.example.ecommercebackend.dto.request.ReviewRequest;
import com.example.ecommercebackend.dto.response.ReviewResponse;
import com.example.ecommercebackend.model.Review;
import com.example.ecommercebackend.model.Product;
import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.repository.ReviewRepository;
import com.example.ecommercebackend.repository.ProductRepository;
import com.example.ecommercebackend.repository.UserRepository;
import com.example.ecommercebackend.service.ReviewService;
import com.example.ecommercebackend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    public ReviewServiceImpl(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) { this.reviewRepository = reviewRepository; this.productRepository = productRepository; this.userRepository = userRepository; }
    @Override
    public ReviewResponse createReview(ReviewRequest request) {
        Review review = new Review();
        review.setRating(request.rating());
        review.setComment(request.comment());
        review.setHelpfulVotes(0);
        review.setTotalVotes(0);
        review.setStatus(com.example.ecommercebackend.model.enums.ReviewStatus.PENDING);
        if (request.productId() != null) {
            Product product = productRepository.findById(request.productId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            review.setProduct(product);
        }
        if (request.userId() != null) {
            User user = userRepository.findById(request.userId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            review.setUser(user);
        }
        return mapToResponse(reviewRepository.save(review));
    }
    
    @Override
    public ReviewResponse getReviewById(Long id) { return mapToResponse(reviewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"))); }
    
    @Override
    public List<ReviewResponse> getAllReviews() { return reviewRepository.findAll().stream().map(this::mapToResponse).toList(); }
    
    @Override
    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public Page<ReviewResponse> getReviewsByCorporateUserId(Long corporateUserId, Pageable pageable) {
        return reviewRepository.findByProductStoreCorporateUserId(corporateUserId, pageable).map(this::mapToResponse);
    }
    
    @Override
    public ReviewResponse updateReviewStatus(Long id, com.example.ecommercebackend.model.enums.ReviewStatus status) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setStatus(status);
        return mapToResponse(reviewRepository.save(review));
    }

    @Override
    public ReviewResponse respondToReview(Long id, String response) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setResponse(response);
        return mapToResponse(reviewRepository.save(review));
    }

    private ReviewResponse mapToResponse(Review review) { 
        return new ReviewResponse(
            review.getId(), 
            review.getProduct() != null ? review.getProduct().getId() : null, 
            review.getUser() != null ? review.getUser().getId() : null, 
            review.getRating(), 
            review.getComment(), 
            review.getResponse(),
            review.getHelpfulVotes(), 
            review.getTotalVotes(), 
            review.getStatus(),
            review.getCreatedAt()
        ); 
    }
}
