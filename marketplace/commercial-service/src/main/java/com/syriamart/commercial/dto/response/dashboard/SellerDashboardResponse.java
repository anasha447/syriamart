package com.syriamart.commercial.dto.response.dashboard;

import com.syriamart.commercial.dto.response.order.OrderListResponse;
import com.syriamart.commercial.dto.response.product.ProductSummaryResponse;

import java.math.BigDecimal;
import java.util.List;

public record SellerDashboardResponse(
        String sellerId,
        long activeProducts, long pendingProducts,
        long ordersThisMonth, BigDecimal revenueThisMonth,
        BigDecimal averageRating,
        List<OrderListResponse> recentOrders,
        List<ProductSummaryResponse> topProducts
) {}
