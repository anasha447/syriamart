package com.syriamart.commercial.dto.response.dashboard;

public record SystemHealthResponse(String commercialServiceStatus, String logisticsServiceStatus, String databaseStatus,
        String eventBusStatus, int activeConnections, long requestsPerMinute, double avgResponseTimeMs) {
}
