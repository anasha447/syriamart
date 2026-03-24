package com.syriamart.commercial.dto.response.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        String cartId, String customerId,
        List<CartItemResponse> items,
        BigDecimal subtotal,
        String appliedCouponCode,
        BigDecimal discountAmount,
        BigDecimal estimatedTotal
) {}
