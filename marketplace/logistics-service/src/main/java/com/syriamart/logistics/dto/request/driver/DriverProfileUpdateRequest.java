package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record DriverProfileUpdateRequest(
        @Size(max = 60) String vehicleMake,
        @Size(max = 60) String vehicleModel,
        Integer vehicleYear,
        @Size(max = 30) String vehicleColor,
        String licenseNumber,
        LocalDate licenseExpiry,
        String profilePhotoUrl,
        String bankName,
        String bankAccountNumber,
        String bankAccountName
) {}
