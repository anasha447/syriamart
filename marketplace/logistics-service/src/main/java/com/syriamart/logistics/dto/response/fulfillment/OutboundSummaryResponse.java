package com.syriamart.logistics.dto.response.fulfillment;

import java.time.LocalDateTime;

public record OutboundSummaryResponse(
        String orderId, String assignedDriverId,
        String scanEventId, LocalDateTime dispatchedAt
) {}
