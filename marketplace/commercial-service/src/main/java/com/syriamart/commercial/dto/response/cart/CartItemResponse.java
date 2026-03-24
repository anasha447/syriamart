package com.syriamart.commercial.dto.response.cart;

import java.math.BigDecimal;

public record CartItemResponse(
        String cartItemId, String productId,
        String productName, String variationValueId,
        String variationSummary, String imageUrl,
        BigDecimal unitPrice, int quantity,
        BigDecimal lineTotal, boolean inStock
) {}
