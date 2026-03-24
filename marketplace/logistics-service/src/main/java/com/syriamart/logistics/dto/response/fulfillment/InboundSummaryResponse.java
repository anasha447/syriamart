package com.syriamart.logistics.dto.response.fulfillment;

import java.time.LocalDateTime;

public record InboundSummaryResponse(
        String orderId, String sellerId,
        String binLocation, String scanEventId,
        LocalDateTime receivedAt, String notes
) {}
