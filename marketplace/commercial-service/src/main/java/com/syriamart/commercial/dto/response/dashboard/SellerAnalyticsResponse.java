package com.syriamart.commercial.dto.response.dashboard;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SellerAnalyticsResponse(BigDecimal totalSales, BigDecimal totalRevenue, BigDecimal platformCommission,
        int totalOrders, int totalProducts, Double averageRating, int totalReviews, BigDecimal averageOrderValue,
        LocalDateTime lastUpdated) {
}
