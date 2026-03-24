package com.syriamart.commercial.dto.response.dashboard;

import java.math.BigDecimal;

public record PlatformAnalyticsResponse(
        int year, int month,
        int totalOrders, BigDecimal totalRevenue,
        long totalCustomers, int activeSellers,
        int newProductsListed, int productsPendingReview,
        BigDecimal platformCommission,
        int cancelledOrders, int returnedOrders
) {}
