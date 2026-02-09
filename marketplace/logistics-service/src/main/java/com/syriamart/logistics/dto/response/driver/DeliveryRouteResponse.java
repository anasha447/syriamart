package com.syriamart.logistics.dto.response.driver;

import java.util.List;

public record DeliveryRouteResponse(String routeId, List<AssignedOrderResponse> stops, double totalDistanceKm,
        int estimatedTimeMinutes, String polyline) {
}
