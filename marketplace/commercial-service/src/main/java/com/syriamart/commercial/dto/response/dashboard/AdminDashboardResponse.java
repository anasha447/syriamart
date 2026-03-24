package com.syriamart.commercial.dto.response.dashboard;

import com.syriamart.commercial.dto.response.product.ProductSummaryResponse;

import java.math.BigDecimal;
import java.util.List;

public record AdminDashboardResponse(
        BigDecimal revenueThisMonth, int ordersThisMonth,
        long activeSellers, long pendingProductModeration,
        long totalCustomers,
        List<SellerListResponse> topSellers,
        List<ProductSummaryResponse> topProducts,
        List<RevenueBreakdownResponse.MonthlyRevenue> revenueChart
) {}
