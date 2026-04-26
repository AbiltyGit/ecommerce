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
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    public ReviewServiceImpl(ReviewRepository reviewRepository, ProductRepository productRepository, UserRepository userRepository) { this.reviewRepository = reviewRepository; this.productRepository = productRepository; this.userRepository = userRepository; }
    public ReviewResponse createReview(ReviewRequest request) {
        Review review = new Review();
        review.setRating(request.rating());
        review.setComment(request.comment());
        review.setHelpfulVotes(0);
        review.setTotalVotes(0);
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
    public ReviewResponse getReviewById(Long id) { return mapToResponse(reviewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"))); }
    public List<ReviewResponse> getAllReviews() { return reviewRepository.findAll().stream().map(this::mapToResponse).toList(); }
    private ReviewResponse mapToResponse(Review review) { return new ReviewResponse(review.getId(), review.getProduct() != null ? review.getProduct().getId() : null, review.getUser() != null ? review.getUser().getId() : null, review.getRating(), review.getComment(), review.getHelpfulVotes(), review.getTotalVotes(), review.getCreatedAt()); }
}
