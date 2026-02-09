package com.syriamart.logistics.dto.request.admin;

import jakarta.validation.constraints.*;

public record DriverRegistrationRequest(@NotBlank String fullName, @NotBlank @Email String email,
        @NotBlank String phone, @NotBlank String password, @NotBlank String vehicleType,
        @NotBlank String vehiclePlateNumber, @NotBlank String licenseNumber) {
}
