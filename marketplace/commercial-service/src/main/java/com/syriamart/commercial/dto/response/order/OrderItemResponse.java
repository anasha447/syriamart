package com.syriamart.commercial.dto.response.order;

import java.math.BigDecimal;

public record OrderItemResponse(String id, String productId, String productName, String productImageUrl,
        String variationDetails, int quantity, BigDecimal unitPrice, BigDecimal subtotal, String status) {
}
