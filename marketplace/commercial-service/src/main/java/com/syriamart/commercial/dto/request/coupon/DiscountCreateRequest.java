package com.syriamart.commercial.dto.request.coupon;

import com.syriamart.commercial.model.enums.DiscountScope;
import com.syriamart.commercial.model.enums.DiscountType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DiscountCreateRequest(
        @NotBlank @Size(max = 100) String name,
        @NotNull DiscountType discountType,
        @NotNull @DecimalMin("0.01") BigDecimal discountValue,
        @NotNull DiscountScope scope,
        String targetProductId,
        String targetCategoryId,
        @NotNull LocalDateTime validFrom,
        @NotNull LocalDateTime validTo
) {}
