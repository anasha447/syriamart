package com.syriamart.commercial.dto.response.customer;

import java.time.LocalDateTime;
import java.util.List;

public record OrderTrackingResponse(String orderId, String qrId, String currentStatus, String currentLocation,
        LocalDateTime lastScannedAt, LocalDateTime expectedDelivery, DriverInfoResponse assignedDriver,
        List<ScanEventResponse> scanHistory) {
}
