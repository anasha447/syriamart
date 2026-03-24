package com.syriamart.logistics.dto.response.driver;

import com.syriamart.common.model.enums.OrderStatus;
import com.syriamart.logistics.model.enums.ScanEventType;

import java.time.LocalDateTime;

public record ScanConfirmationResponse(
        String scanEventId,
        String orderId,
        ScanEventType eventType,
        OrderStatus newOrderStatus,
        String location,
        LocalDateTime scannedAt,
        String message
) {}
