package com.syriamart.commercial.dto.response.review;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record ReviewSummaryResponse(
        BigDecimal averageRating, long totalReviews,
        Map<Integer, Long> ratingDistribution,
        List<ReviewResponse> recentReviews
) {}
