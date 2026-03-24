package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.review.ReviewSubmitRequest;
import com.syriamart.commercial.dto.response.review.ReviewResponse;
import com.syriamart.commercial.dto.response.review.ReviewSummaryResponse;
import com.syriamart.commercial.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // ── Public ────────────────────────────────────────────────────────────────

    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<ReviewSummaryResponse> summary(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getSummary(productId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> productReviews(
            @PathVariable String productId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getApprovedReviews(productId,
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    // ── Customer ──────────────────────────────────────────────────────────────

    @PostMapping("/product/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponse> submit(
            @PathVariable String productId,
            @Valid @RequestBody ReviewSubmitRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(reviewService.submitReview(user.getUsername(), productId, request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ReviewResponse>> myReviews(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(reviewService.getMyReviews(user.getUsername(),
                PageRequest.of(page, size)));
    }

    // ── Seller ────────────────────────────────────────────────────────────────

    @PostMapping("/{reviewId}/reply")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ReviewResponse> reply(
            @PathVariable String reviewId,
            @RequestParam String reply,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(reviewService.replyToReview(reviewId, user.getUsername(), reply));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    @PatchMapping("/admin/{reviewId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewResponse> approve(@PathVariable String reviewId) {
        return ResponseEntity.ok(reviewService.approveReview(reviewId));
    }

    @DeleteMapping("/admin/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}
