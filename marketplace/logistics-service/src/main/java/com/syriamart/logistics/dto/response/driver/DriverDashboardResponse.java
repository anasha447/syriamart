package com.syriamart.logistics.dto.response.driver;

import com.syriamart.logistics.model.enums.DriverStatus;

import java.math.BigDecimal;
import java.util.List;

public record DriverDashboardResponse(
        String driverId, String fullName,
        DriverStatus currentStatus,
        int deliveriesToday, int deliveriesThisMonth,
        BigDecimal earningsToday, BigDecimal earningsThisMonth,
        BigDecimal pendingPayout,
        long unreadMessages,
        List<AssignedOrderResponse> activeOrders
) {}
