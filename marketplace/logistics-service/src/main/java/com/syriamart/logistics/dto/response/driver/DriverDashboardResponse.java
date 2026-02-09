package com.syriamart.logistics.dto.response.driver;

import java.math.BigDecimal;

public record DriverDashboardResponse(int activeDeliveries, int completedToday, double todayEarnings,
        double totalRating, String onlineStatus, int totalDistanceKm) {
}
