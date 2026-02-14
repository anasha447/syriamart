package com.syriamart.logistics.dto.response.tracking;

import com.syriamart.logistics.dto.response.driver.DriverInfoResponse;
import java.time.LocalDateTime;
import java.util.List;

public record OrderTrackingResponse(String orderId, String qrId, String currentStatus, String currentLocation,
        LocalDateTime lastScannedAt, LocalDateTime expectedDelivery, DriverInfoResponse assignedDriver,
        List<ScanEventResponse> scanHistory) {
}
