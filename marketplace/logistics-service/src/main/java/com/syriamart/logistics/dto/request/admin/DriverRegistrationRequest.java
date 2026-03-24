package com.syriamart.logistics.dto.request.admin;

import com.syriamart.logistics.model.enums.VehicleType;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record DriverRegistrationRequest(
        @NotBlank @Size(max = 80) String firstName,
        @NotBlank @Size(max = 80) String lastName,
        @NotBlank @Email         String email,
        @NotBlank @Size(max = 20) String phone,
        @NotBlank @Size(min = 8) String password,

        // Vehicle
        @NotNull VehicleType vehicleType,
        @Size(max = 60) String vehicleMake,
        @Size(max = 60) String vehicleModel,
        Integer vehicleYear,
        @Size(max = 20) String vehiclePlate,
        @Size(max = 30) String vehicleColor,

        // License
        @NotBlank @Size(max = 40) String licenseNumber,
        @NotNull LocalDate licenseExpiry,
        @NotBlank @Size(max = 20) String nationalId
) {}
