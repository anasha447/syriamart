package com.syriamart.commercial.dto.response.order;

import com.syriamart.commercial.model.enums.OrderItemStatus;

import java.time.LocalDateTime;

public record OrderStatusEventResponse(
        String orderItemId, OrderItemStatus newStatus,
        String sellerNote, LocalDateTime updatedAt
) {}
