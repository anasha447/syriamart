package com.syriamart.logistics.dto.response.driver;

import com.syriamart.common.model.enums.OrderStatus;

public record AssignedOrderResponse(
        String orderId, OrderStatus currentStatus,
        String customerName, String customerPhone,
        String shippingAddressLine1, String shippingAddressLine2,
        String city, String governorate,
        Double destinationLatitude, Double destinationLongitude,
        String notes, String lastScanLocation
) {}
