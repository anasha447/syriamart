package com.syriamart.logistics.dto.response.fulfillment;

import java.time.LocalDateTime;
import java.util.List;

public record InboundSummaryResponse(int totalScanned, List<String> recentOrderIds, LocalDateTime lastScanTime) {
}
