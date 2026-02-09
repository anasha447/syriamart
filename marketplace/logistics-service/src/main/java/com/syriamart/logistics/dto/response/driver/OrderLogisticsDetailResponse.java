package com.syriamart.logistics.dto.response.driver;

import java.math.BigDecimal;

public record OrderLogisticsDetailResponse(String orderId, String qrId, String status, BigDecimal weightKg,
        String dimensions, String pickupPointName, String deliveryType) {
}
