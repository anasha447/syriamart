package com.syriamart.logistics.dto.request.driver;

import com.syriamart.logistics.model.enums.DriverStatus;
import jakarta.validation.constraints.NotNull;

public record DriverStatusUpdateRequest(
        @NotNull DriverStatus status
) {}
