package com.syriamart.common.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderScannedEvent(
        String orderId,
        String scanEventId,
        String newStatus,
        String location,
        BigDecimal latitude,
        BigDecimal longitude,
        String scannedByDriverId,
        LocalDateTime scannedAt) {
}
