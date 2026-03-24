package com.syriamart.logistics.dto.response.driver;

import com.syriamart.logistics.model.enums.ShiftStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ShiftSummaryResponse(
        String shiftId, String driverId,
        ShiftStatus status,
        LocalDateTime startedAt, LocalDateTime endedAt,
        int deliveriesCompleted, int deliveriesFailed,
        int returnsHandled, BigDecimal totalDistanceKm,
        BigDecimal shiftEarnings, String summary
) {}
