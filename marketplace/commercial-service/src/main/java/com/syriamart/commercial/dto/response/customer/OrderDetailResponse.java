package com.syriamart.commercial.dto.response.customer;

import com.syriamart.commercial.dto.response.seller.OrderItemResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailResponse(String id, String qrId, String status, List<OrderItemResponse> items,
        BigDecimal subtotal, BigDecimal discountAmount, BigDecimal shippingFee, BigDecimal total,
        AddressResponse deliveryAddress, PickupPointResponse pickupPoint, String paymentMethod, String paymentStatus,
        LocalDateTime createdAt, LocalDateTime expectedDelivery, List<OrderStatusEventResponse> statusHistory,
        ScanEventResponse latestScan) {
}
