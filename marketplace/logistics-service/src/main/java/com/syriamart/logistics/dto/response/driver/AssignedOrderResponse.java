package com.syriamart.logistics.dto.response.driver;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AssignedOrderResponse(String orderId, String qrId, String pickupAddress, String deliveryAddress,
        BigDecimal deliveryFee, LocalDateTime expectedDeliveryTime, String customerName, String customerPhone,
        String status, String note) {
}
