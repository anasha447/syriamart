package com.syriamart.logistics.dto.response.tracking;

import com.syriamart.logistics.model.enums.ScanEventType;

import java.time.LocalDateTime;

public record ScanEventResponse(
        String id, String orderId,
        ScanEventType eventType, String location,
        Double latitude, Double longitude,
        String notes, LocalDateTime scannedAt
) {}
