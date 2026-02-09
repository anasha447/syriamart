package com.syriamart.common.event;

import java.math.BigDecimal;

public record OrderItemEventData(
        String productId,
        String productName,
        int quantity,
        BigDecimal price) {
}
