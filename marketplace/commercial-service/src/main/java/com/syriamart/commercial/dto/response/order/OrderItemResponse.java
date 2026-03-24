package com.syriamart.commercial.dto.response.order;

import com.syriamart.commercial.model.enums.OrderItemStatus;

import java.math.BigDecimal;

public record OrderItemResponse(
        String id, String productId, String productName,
        String variationSnapshot, String imageUrl,
        BigDecimal unitPrice, int quantity, BigDecimal lineTotal,
        OrderItemStatus status, String sellerId, String sellerNote
) {}
