package com.syriamart.commercial.dto.response.order;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutSummaryResponse(
        String orderId,
        List<OrderItemResponse> items,
        BigDecimal subtotal, BigDecimal discountAmount,
        BigDecimal shippingFee, BigDecimal total,
        String appliedCouponCode, String message
) {}
