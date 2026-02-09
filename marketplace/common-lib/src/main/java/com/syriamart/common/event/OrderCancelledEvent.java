package com.syriamart.common.event;

import java.time.LocalDateTime;

public record OrderCancelledEvent(
        String orderId,
        String reason,
        String cancelledBy, // "customer", "seller", "admin"
        LocalDateTime cancelledAt) {
}
