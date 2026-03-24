package com.syriamart.commercial.dto.response.dashboard;

public record SystemHealthResponse(
        String status, long totalProducts,
        long totalOrders, long totalCoupons,
        String dbStatus, String messageStatus
) {}
