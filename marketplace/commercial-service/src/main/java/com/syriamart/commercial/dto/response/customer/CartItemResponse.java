package com.syriamart.commercial.dto.response.customer;

import java.math.BigDecimal;

public record CartItemResponse(String id, String productId, String productName, String productImageUrl,
        String variationDetails, int quantity, BigDecimal unitPrice, BigDecimal subtotal, String discountLabel,
        boolean inStock) {
}
