package com.example.ecommercebackend.controller;
import com.example.ecommercebackend.dto.request.ReviewRequest;
import com.example.ecommercebackend.dto.response.ReviewResponse;
import com.example.ecommercebackend.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;
    public ReviewController(ReviewService reviewService) { this.reviewService = reviewService; }
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest request) { return new ResponseEntity<>(reviewService.createReview(request), HttpStatus.CREATED); }
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id) { return ResponseEntity.ok(reviewService.getReviewById(id)); }
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() { return ResponseEntity.ok(reviewService.getAllReviews()); }
}
