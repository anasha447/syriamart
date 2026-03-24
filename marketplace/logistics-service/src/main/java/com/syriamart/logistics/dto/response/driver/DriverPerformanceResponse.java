package com.syriamart.logistics.dto.response.driver;

import java.math.BigDecimal;

public record DriverPerformanceResponse(
        String driverId, String fullName,
        int totalDeliveries, int successfulDeliveries,
        int failedDeliveries, int totalReturnsHandled,
        double successRate, BigDecimal averageRating,
        BigDecimal totalEarnings
) {}
