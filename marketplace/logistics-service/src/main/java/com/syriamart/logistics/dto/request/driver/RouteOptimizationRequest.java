package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/**
 * Driver requests an optimized delivery sequence for a set of order IDs.
 * The service re-orders the list by proximity to current driver location.
 */
public record RouteOptimizationRequest(
        @NotEmpty List<String> orderIds,
        Double currentLatitude,
        Double currentLongitude
) {}
