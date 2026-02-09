package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record DriverLocationUpdateRequest(@NotNull BigDecimal latitude, @NotNull BigDecimal longitude, Double speed,
        Double heading) {
}
