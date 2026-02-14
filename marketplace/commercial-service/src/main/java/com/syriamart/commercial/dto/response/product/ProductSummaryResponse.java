package com.syriamart.commercial.dto.response.product;

import java.math.BigDecimal;

public record ProductSummaryResponse(String id, String name, BigDecimal price, int stock, String status,
        String mainImageUrl) {
}
