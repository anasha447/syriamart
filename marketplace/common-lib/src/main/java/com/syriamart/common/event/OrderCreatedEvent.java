package com.syriamart.common.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderCreatedEvent(
        String orderId,
        String userId,
        String sellerId,
        String qrId,
        BigDecimal totalAmount,
        String deliveryAddressLine1,
        String deliveryCity,
        String deliveryState,
        String deliveryPostalCode,
        List<OrderItemEventData> items,
        LocalDateTime createdAt,
        LocalDateTime expectedDelivery) {
}
