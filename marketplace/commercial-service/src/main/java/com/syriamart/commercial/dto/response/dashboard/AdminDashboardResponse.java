package com.syriamart.commercial.dto.response.dashboard;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminDashboardResponse(
        int totalUsers,
        int activeUsers,
        int totalSellers,
        int activeSellers,
        int pendingSellerApprovals,
        int totalProducts,
        int activeProducts,
        int pendingProductApprovals,
        int totalOrders,
        BigDecimal totalRevenue,
        BigDecimal adminRevenue,
        BigDecimal averageOrderValue,
        LocalDateTime lastUpdated) {
}
