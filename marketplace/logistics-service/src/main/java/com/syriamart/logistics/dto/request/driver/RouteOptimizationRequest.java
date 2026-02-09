package com.syriamart.logistics.dto.request.driver;

import java.math.BigDecimal;

public record RouteOptimizationRequest(BigDecimal currentLatitude, BigDecimal currentLongitude,
        boolean includeTrafficData) {
}
