package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.review.ReviewSubmitRequest;
import com.syriamart.commercial.dto.response.review.ReviewResponse;
import com.syriamart.commercial.dto.response.review.ReviewSummaryResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {
    ReviewResponse submitReview(String customerId, String productId, ReviewSubmitRequest request);
    ReviewSummaryResponse getSummary(String productId);
    List<ReviewResponse> getApprovedReviews(String productId, Pageable pageable);
    List<ReviewResponse> getMyReviews(String customerId, Pageable pageable);

    // Seller
    ReviewResponse replyToReview(String reviewId, String sellerId, String reply);

    // Admin
    ReviewResponse approveReview(String reviewId);
    void deleteReview(String reviewId);
}
