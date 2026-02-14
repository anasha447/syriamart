package com.syriamart.commercial.dto.response.category;

import java.math.BigDecimal;
import java.util.List;

public record CategoryTreeResponse(String id, String name, String description, BigDecimal adminProfitPercentage,
        int productCount, List<CategoryTreeResponse> children) {
}
