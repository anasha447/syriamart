package com.syriamart.commercial.dto.response.customer;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderListResponse(String id, String qrId, int itemCount, BigDecimal total, String status,
        LocalDateTime createdAt, LocalDateTime expectedDelivery, String sellerName) {
}
