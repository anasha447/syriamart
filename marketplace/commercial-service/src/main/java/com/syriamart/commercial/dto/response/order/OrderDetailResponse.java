package com.syriamart.commercial.dto.response.order;

import com.syriamart.common.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailResponse(
        String id, String customerId,
        OrderStatus status, String trackingNumber,
        String shippingFullName, String shippingPhone,
        String shippingAddressLine1, String shippingAddressLine2,
        String shippingCity, String shippingGovernorate,
        BigDecimal subtotal, BigDecimal discountAmount,
        BigDecimal shippingFee, BigDecimal total,
        String couponCode, String notes,
        List<OrderItemResponse> items,
        LocalDateTime createdAt, LocalDateTime updatedAt
) {}
