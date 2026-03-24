package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.NotNull;

public record DriverLocationUpdateRequest(
        @NotNull Double latitude,
        @NotNull Double longitude
) {}
