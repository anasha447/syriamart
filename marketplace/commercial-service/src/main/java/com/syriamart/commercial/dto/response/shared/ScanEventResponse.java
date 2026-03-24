package com.syriamart.commercial.dto.response.shared;

import java.time.LocalDateTime;

public record ScanEventResponse(String id, String orderId, String location, String eventType, LocalDateTime scannedAt) {}
