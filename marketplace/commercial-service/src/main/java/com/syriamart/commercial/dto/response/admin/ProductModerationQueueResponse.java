package com.syriamart.commercial.dto.response.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductModerationQueueResponse(String productId, String name, String sellerName, String sellerId,
        String categoryName, String status, BigDecimal price, String mainImageUrl, LocalDateTime submittedAt) {
}
