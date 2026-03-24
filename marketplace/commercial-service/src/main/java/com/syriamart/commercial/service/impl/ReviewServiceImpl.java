package com.syriamart.commercial.service.impl;

import com.syriamart.commercial.dto.request.review.ReviewSubmitRequest;
import com.syriamart.commercial.dto.response.review.ReviewResponse;
import com.syriamart.commercial.dto.response.review.ReviewSummaryResponse;
import com.syriamart.commercial.mapper.ReviewMapper;
import com.syriamart.commercial.model.Product;
import com.syriamart.commercial.model.Review;
import com.syriamart.commercial.model.enums.OrderItemStatus;
import com.syriamart.commercial.repository.*;
import com.syriamart.commercial.service.ReviewService;
import com.syriamart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository    reviewRepo;
    private final ProductRepository   productRepo;
    private final OrderItemRepository orderItemRepo;
    private final ReviewMapper        reviewMapper;

    @Override
    public ReviewResponse submitReview(String customerId, String productId,
                                       ReviewSubmitRequest req) {
        // Guard: only one review per order line item
        if (reviewRepo.existsByOrderItemId(req.orderItemId())) {
            throw new IllegalStateException("A review already exists for this order item.");
        }

        // Guard: must be a verified purchaser
        boolean verified = orderItemRepo.hasCustomerDeliveredItem(customerId, productId);
        if (!verified) {
            throw new IllegalStateException(
                    "You can only review products you have purchased and received.");
        }

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        Review review = Review.builder()
                .product(product)
                .customerId(customerId)
                .orderItemId(req.orderItemId())
                .rating(req.rating())
                .comment(req.comment())
                .verifiedPurchase(true)
                .approved(false) // admin or auto-approves
                .build();

        Review saved = reviewRepo.save(review);

        // Recompute cached stats on the product
        refreshProductRating(product);

        return reviewMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewSummaryResponse getSummary(String productId) {
        BigDecimal avg = reviewRepo.computeAverageRating(productId);
        long total     = reviewRepo.countApproved(productId);

        List<Review> recent = reviewRepo
                .findByProductIdAndApprovedTrue(productId, Pageable.ofSize(5))
                .getContent();

        // Distribution
        Map<Integer, Long> distribution = recent.stream()
                .collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));
        for (int i = 1; i <= 5; i++) distribution.putIfAbsent(i, 0L);

        return new ReviewSummaryResponse(
                avg != null ? avg : BigDecimal.ZERO,
                total, distribution,
                reviewMapper.toResponseList(recent));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getApprovedReviews(String productId, Pageable pageable) {
        return reviewMapper.toResponseList(
                reviewRepo.findByProductIdAndApprovedTrue(productId, pageable).getContent());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyReviews(String customerId, Pageable pageable) {
        return reviewMapper.toResponseList(
                reviewRepo.findByCustomerId(customerId, pageable).getContent());
    }

    @Override
    public ReviewResponse replyToReview(String reviewId, String sellerId, String reply) {
        Review review = getReview(reviewId);
        // Ensure the seller owns the product
        if (!review.getProduct().getSellerId().equals(sellerId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You can only reply to reviews on your own products.");
        }
        review.setSellerReply(reply);
        return reviewMapper.toResponse(reviewRepo.save(review));
    }

    @Override
    public ReviewResponse approveReview(String reviewId) {
        Review review = getReview(reviewId);
        review.setApproved(true);
        Review saved = reviewRepo.save(review);
        refreshProductRating(review.getProduct());
        return reviewMapper.toResponse(saved);
    }

    @Override
    public void deleteReview(String reviewId) {
        Review review = getReview(reviewId);
        Product product = review.getProduct();
        reviewRepo.delete(review);
        refreshProductRating(product);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Review getReview(String id) {
        return reviewRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", id));
    }

    /** Re-calculates and persists averageRating + totalReviews on the Product. */
    private void refreshProductRating(Product product) {
        BigDecimal avg = reviewRepo.computeAverageRating(product.getId());
        long count     = reviewRepo.countApproved(product.getId());
        product.setAverageRating(avg != null ? avg.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        product.setTotalReviews((int) count);
        productRepo.save(product);
    }
}
