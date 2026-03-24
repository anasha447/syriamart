package com.syriamart.commercial.dto.response.dashboard;

import java.math.BigDecimal;

public record SellerListResponse(
        String sellerId, String storeName,
        long totalProducts, int totalOrders,
        BigDecimal totalRevenue, BigDecimal averageRating
) {}
