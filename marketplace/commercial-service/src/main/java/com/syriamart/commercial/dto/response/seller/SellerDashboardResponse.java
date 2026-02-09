package com.syriamart.commercial.dto.response.seller;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SellerDashboardResponse(int totalProducts, int activeProducts, int pendingApprovals, int rejectedProducts,
        int totalOrders, int pendingOrders, int shippedOrders, int completedOrders, BigDecimal totalSales,
        BigDecimal totalRevenue, BigDecimal platformCommission, Double averageRating, int totalReviews,
        LocalDateTime lastUpdated) {
}
