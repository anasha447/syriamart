package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.*;

public record DriverLoginRequest(@NotBlank String emailOrPhone, @NotBlank String password, @NotNull String deviceId) {
}
