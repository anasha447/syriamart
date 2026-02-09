package com.syriamart.commercial.dto.response.seller;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductListResponse(String id, String name, String categoryName, BigDecimal price, int stock,
        String status, boolean adminApproved, String mainImageUrl, LocalDateTime createdAt) {
}
