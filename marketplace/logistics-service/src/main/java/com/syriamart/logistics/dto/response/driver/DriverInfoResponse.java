package com.syriamart.logistics.dto.response.driver;

import com.syriamart.logistics.model.enums.DriverStatus;

public record DriverInfoResponse(
        String id, String firstName, String lastName,
        String email, String phone,
        DriverStatus status, boolean active,
        Double currentLatitude, Double currentLongitude,
        String lastLocationUpdate
) {}
