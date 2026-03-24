package com.syriamart.logistics.service;

import com.syriamart.logistics.dto.response.tracking.OrderTrackingResponse;
import com.syriamart.logistics.dto.response.driver.OrderLogisticsDetailResponse;

public interface TrackingService {
    /** Public — no auth. */
    OrderTrackingResponse trackByOrderId(String orderId);
    OrderTrackingResponse trackByTrackingNumber(String trackingNumber);

    /** Internal / admin. */
    OrderLogisticsDetailResponse getAdminDetail(String orderId);
}
