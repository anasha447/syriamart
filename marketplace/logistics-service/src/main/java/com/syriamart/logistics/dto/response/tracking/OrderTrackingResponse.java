package com.syriamart.logistics.dto.response.tracking;

import com.syriamart.common.model.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * The full tracking timeline shown to a customer via the public
 * GET /api/tracking/{orderId} endpoint (no auth required).
 */
public record OrderTrackingResponse(
        String orderId,
        String trackingNumber,
        OrderStatus currentStatus,
        String estimatedDeliveryCity,
        String assignedDriverName,
        LocalDateTime lastUpdated,
        List<ScanEventResponse> timeline
) {}
