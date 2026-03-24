package com.syriamart.logistics.dto.response.driver;

import com.syriamart.common.model.enums.OrderStatus;
import com.syriamart.logistics.dto.response.tracking.ScanEventResponse;

import java.util.List;

public record OrderLogisticsDetailResponse(
        String orderId, OrderStatus currentStatus,
        String customerName, String customerPhone,
        String shippingAddress, String city, String governorate,
        String trackingNumber, String assignedDriverId,
        List<ScanEventResponse> scanHistory
) {}
