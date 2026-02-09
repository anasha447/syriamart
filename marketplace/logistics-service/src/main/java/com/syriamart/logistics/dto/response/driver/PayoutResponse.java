package com.syriamart.logistics.dto.response.driver;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PayoutResponse(String payoutId, BigDecimal amount, String status, LocalDateTime processedAt,
        String referenceNumber) {
}
