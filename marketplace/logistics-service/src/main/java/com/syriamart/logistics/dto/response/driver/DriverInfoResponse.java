package com.syriamart.logistics.dto.response.driver;

public record DriverInfoResponse(String driverId, String name, String phone, String vehicleType,
        String vehiclePlateNumber) {
}
