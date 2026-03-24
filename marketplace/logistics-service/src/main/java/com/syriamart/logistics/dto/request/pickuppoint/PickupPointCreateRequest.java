package com.syriamart.logistics.dto.request.pickuppoint;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record PickupPointCreateRequest(
        @NotBlank String name,
        @NotBlank String addressLine1,
        String addressLine2,
        @NotBlank String city,
        @NotBlank String governorate,
        Double latitude,
        Double longitude,
        String contactPhone,
        String operatingHours,
        @Min(1) int maxCapacity
) {}
