package com.syriamart.common.event;

import java.time.LocalDateTime;

public record ReturnRequestedEvent(
        String returnRequestId,
        String orderId,
        String orderItemId,
        String customerId,
        String reason,
        LocalDateTime requestedAt) {
}
