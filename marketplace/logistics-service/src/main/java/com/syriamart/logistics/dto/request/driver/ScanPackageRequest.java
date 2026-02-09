package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ScanPackageRequest(@NotBlank String qrContent, @NotNull BigDecimal latitude,
        @NotNull BigDecimal longitude, String note) {
}
