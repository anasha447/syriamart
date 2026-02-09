package com.syriamart.logistics.dto.response.fulfillment;

import java.time.LocalDateTime;
import java.util.List;

public record OutboundSummaryResponse(int totalDispatched, List<String> dispatchedOrderIds, String driverName,
        LocalDateTime dispatchTime) {
}
