package com.syriamart.commercial.dto.response.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(String cartId, List<CartItemResponse> items, BigDecimal subtotal, BigDecimal discountAmount,
        BigDecimal shippingFee, BigDecimal total, int itemCount, String appliedCouponCode) {
}
