package com.syriamart.commercial.dto.response.order;

import com.syriamart.commercial.dto.response.address.AddressResponse;
import com.syriamart.commercial.dto.response.shared.PickupPointResponse;
import com.syriamart.commercial.dto.response.shared.ScanEventResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailResponse(String id, String qrId, String status, List<OrderItemResponse> items,
        BigDecimal subtotal, BigDecimal discountAmount, BigDecimal shippingFee, BigDecimal total,
        AddressResponse deliveryAddress, PickupPointResponse pickupPoint, String paymentMethod, String paymentStatus,
        LocalDateTime createdAt, LocalDateTime expectedDelivery, List<OrderStatusEventResponse> statusHistory,
        ScanEventResponse latestScan,
        // Snapshot fields
        String customerNameSnapshot,
        String customerEmailSnapshot,
        String shippingAddressSnapshot,
        String contactPhoneSnapshot
        ) {
}
