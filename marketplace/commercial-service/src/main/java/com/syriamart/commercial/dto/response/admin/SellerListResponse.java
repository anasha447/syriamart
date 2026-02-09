package com.syriamart.commercial.dto.response.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SellerListResponse(
        String id,
        String name,
        String email,
        String status,
        boolean adminApproved,
        int productCount,
        int orderCount,
        BigDecimal totalSales,
        LocalDateTime createdAt) {
}
