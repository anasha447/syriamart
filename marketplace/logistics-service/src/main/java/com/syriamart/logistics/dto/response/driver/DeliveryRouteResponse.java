package com.syriamart.logistics.dto.response.driver;

import java.util.List;

/** Optimised delivery sequence returned after a RouteOptimizationRequest. */
public record DeliveryRouteResponse(
        String driverId,
        List<RouteStop> stops,
        double estimatedTotalDistanceKm
) {
    public record RouteStop(
            int sequence, String orderId,
            String address, String city,
            Double latitude, Double longitude,
            String customerPhone
    ) {}
}
