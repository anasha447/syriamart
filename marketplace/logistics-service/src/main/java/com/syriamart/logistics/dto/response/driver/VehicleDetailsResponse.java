package com.syriamart.logistics.dto.response.driver;

import java.time.LocalDate;

public record VehicleDetailsResponse(String vehicleId, String type, String model, String plateNumber, String color,
        LocalDate registrationExpiry) {
}
