package com.syriamart.commercial.dto.response.order;

import com.syriamart.common.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Compact order row for list views. */
public record OrderListResponse(
        String id, OrderStatus status,
        BigDecimal total, int itemCount,
        String trackingNumber, LocalDateTime createdAt
) {}
