package com.syriamart.commercial.dto.response.dashboard;

import java.math.BigDecimal;
import java.util.List;

public record RevenueBreakdownResponse(
        BigDecimal totalRevenue,
        BigDecimal platformCommission,
        List<MonthlyRevenue> monthly
) {
    public record MonthlyRevenue(int year, int month, BigDecimal revenue) {}
}
