package com.syriamart.commercial.dto.response.dashboard;

import java.math.BigDecimal;
import java.util.Map;

public record RevenueBreakdownResponse(Map<String, BigDecimal> revenueByProduct,
        Map<String, BigDecimal> revenueByCategory, Map<String, BigDecimal> revenueByMonth, BigDecimal totalRevenue) {
}
