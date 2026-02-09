package com.syriamart.logistics.dto.response.driver;

import java.time.LocalDateTime;

public record ScanConfirmationResponse(String orderId, String qrId, String newStatus, boolean success, String message,
        LocalDateTime scannedAt) {
}
