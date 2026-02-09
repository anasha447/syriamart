package com.syriamart.commercial.dto.response.seller;

import com.syriamart.commercial.dto.response.customer.AddressResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderSellerViewResponse(String orderId, String qrId, String customerName, String customerEmail,
        List<OrderItemResponse> myItems, BigDecimal mySubtotal, BigDecimal myCommission, BigDecimal myRevenue,
        String status, String paymentStatus, String paymentMethod, AddressResponse deliveryAddress,
        LocalDateTime createdAt, LocalDateTime expectedDelivery) {
}
