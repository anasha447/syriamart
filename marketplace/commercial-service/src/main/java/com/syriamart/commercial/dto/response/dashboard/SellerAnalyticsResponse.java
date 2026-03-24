package com.syriamart.commercial.dto.response.dashboard;

import java.math.BigDecimal;

public record SellerAnalyticsResponse(
        String sellerId, int year, int month,
        int totalOrders, int completedOrders,
        int cancelledOrders, int returnedOrders,
        BigDecimal totalRevenue, int totalItemsSold,
        BigDecimal averageOrderValue,
        BigDecimal averageRating, int totalReviews,
        BigDecimal returnRate
) {}
