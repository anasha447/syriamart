package com.syriamart.commercial.dto.response.order;

import com.syriamart.commercial.model.enums.OrderItemStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** What a seller sees when viewing their incoming order items. */
public record OrderSellerViewResponse(
        String orderId, String customerId,
        String shippingFullName, String shippingPhone,
        String shippingCity, String shippingGovernorate,
        List<OrderItemResponse> items,
        BigDecimal sellerSubtotal,
        OrderItemStatus aggregateStatus,
        LocalDateTime orderedAt
) {}
