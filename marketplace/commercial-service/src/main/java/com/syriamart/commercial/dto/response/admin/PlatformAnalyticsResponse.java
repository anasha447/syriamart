package com.syriamart.commercial.dto.response.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public record PlatformAnalyticsResponse(BigDecimal totalRevenue, BigDecimal adminRevenue, BigDecimal sellerRevenue,
        int totalOrders, int completedOrders, int cancelledOrders, BigDecimal averageOrderValue, int newUsersThisMonth,
        int newSellersThisMonth, Map<String, Integer> ordersByStatus, Map<String, BigDecimal> revenueByCategory,
        LocalDateTime lastUpdated) {
}
