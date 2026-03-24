package com.syriamart.logistics.dto.response.driver;

import com.syriamart.logistics.model.enums.DriverStatus;
import com.syriamart.logistics.model.enums.VehicleType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DriverProfileResponse(
        String id, String firstName, String lastName,
        String email, String phone, DriverStatus status,
        String profilePhotoUrl,
        VehicleType vehicleType, String vehicleMake, String vehicleModel,
        Integer vehicleYear, String vehiclePlate, String vehicleColor,
        String licenseNumber, LocalDate licenseExpiry,
        BigDecimal averageRating, int totalDeliveries, double successRate,
        BigDecimal totalEarnings, BigDecimal pendingPayout
) {}
