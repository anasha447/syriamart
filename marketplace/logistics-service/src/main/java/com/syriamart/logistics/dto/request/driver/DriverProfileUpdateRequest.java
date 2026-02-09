package com.syriamart.logistics.dto.request.driver;

public record DriverProfileUpdateRequest(String phoneNumber, String vehiclePlateNumber, String vehicleType,
        String profileImageUrl) {
}
