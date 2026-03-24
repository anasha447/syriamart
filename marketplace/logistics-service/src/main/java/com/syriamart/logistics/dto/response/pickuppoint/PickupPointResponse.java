package com.syriamart.logistics.dto.response.pickuppoint;

public record PickupPointResponse(
        String id, String name,
        String addressLine1, String addressLine2,
        String city, String governorate,
        Double latitude, Double longitude,
        String contactPhone, String operatingHours,
        int maxCapacity, int currentOccupancy,
        boolean active
) {}
