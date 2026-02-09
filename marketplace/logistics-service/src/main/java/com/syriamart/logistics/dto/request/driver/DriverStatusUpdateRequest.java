package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.*;

public record DriverStatusUpdateRequest(@NotNull @Pattern(regexp = "ONLINE|OFFLINE|BUSY|ON_DELIVERY") String status,
        Double latitude, Double longitude) {
}
