package com.syriamart.logistics.dto.response.driver;

import java.time.LocalDateTime;
import java.util.List;

public record LocationHistoryResponse(
        String driverId,
        List<LocationPoint> points
) {
    public record LocationPoint(
            double latitude, double longitude,
            String location, LocalDateTime recordedAt
    ) {}
}
