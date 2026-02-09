package com.syriamart.commercial.dto.request.seller;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DiscountCreateRequest(@NotNull @Pattern(regexp = "percentage|fixed") String discountType,
        @NotNull @DecimalMin("0") BigDecimal value, @NotNull LocalDateTime startDate, @NotNull LocalDateTime endDate,
        @NotNull @Pattern(regexp = "PRODUCT|CATEGORY|SELLER") String scopeType, String targetId,
        @Size(max = 200) String description) {
}
