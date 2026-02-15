package com.syriamart.commercial.dto.response.shared;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ScanEventResponse(String scanId, String orderId, String location, BigDecimal latitude,
        BigDecimal longitude, String previousStatus, String newStatus, LocalDateTime scannedAt,
        String scannedByDriverName) {
}
