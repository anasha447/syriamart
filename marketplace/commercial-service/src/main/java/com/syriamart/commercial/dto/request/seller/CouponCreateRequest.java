package com.syriamart.commercial.dto.request.seller;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CouponCreateRequest(@NotBlank @Size(min = 4, max = 20) String code, @Size(max = 200) String description,
        @NotNull @Pattern(regexp = "percentage|fixed") String discountType, @NotNull @DecimalMin("0") BigDecimal value,
        @DecimalMin("0") BigDecimal minOrderAmount, @NotNull @Min(1) Integer maxUses, @NotNull LocalDateTime startDate,
        @NotNull LocalDateTime endDate) {
}
