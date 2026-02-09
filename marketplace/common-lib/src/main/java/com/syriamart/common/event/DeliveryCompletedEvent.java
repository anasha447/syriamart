package com.syriamart.common.event;

import java.time.LocalDateTime;

public record DeliveryCompletedEvent(
        String orderId,
        String driverId,
        LocalDateTime completedAt,
        String signatureImageUrl) {
}
