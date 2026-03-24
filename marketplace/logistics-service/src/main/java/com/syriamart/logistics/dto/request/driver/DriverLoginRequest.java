package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DriverLoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {}
