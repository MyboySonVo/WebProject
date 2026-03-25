package com.booking.api.controller;

import com.booking.api.dto.ReviewRequest;
import com.booking.api.dto.ReviewResponse;
import com.booking.api.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** Gửi đánh giá — yêu cầu đăng nhập */
    @PostMapping
    public ResponseEntity<ReviewResponse> submitReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.submitReview(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    /** Xem danh sách đánh giá theo chuyến đi — public */
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(reviewService.getReviewsByTrip(tripId));
    }

    /** Xem tất cả đánh giá — dành cho Provider/Admin */
    @GetMapping("/all")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
}
