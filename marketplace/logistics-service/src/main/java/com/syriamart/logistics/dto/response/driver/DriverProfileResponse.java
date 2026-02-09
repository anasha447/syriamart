package com.syriamart.logistics.dto.response.driver;

import java.time.LocalDate;

public record DriverProfileResponse(String driverId, String fullName, String email, String phone, String vehicleType,
        String plateNumber, String licenseNumber, LocalDate joinedDate, double rating, String profileImageUrl) {
}
