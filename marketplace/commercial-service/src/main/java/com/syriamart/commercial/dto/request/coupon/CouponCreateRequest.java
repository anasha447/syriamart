package com.syriamart.commercial.dto.request.coupon;

import com.syriamart.commercial.model.enums.DiscountType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CouponCreateRequest(
        @NotBlank @Size(max = 30) String code,
        @Size(max = 200) String description,
        @NotNull DiscountType discountType,
        @NotNull @DecimalMin("0.01") BigDecimal discountValue,
        BigDecimal minOrderAmount,
        BigDecimal maxDiscountAmount,
        @NotNull LocalDateTime validFrom,
        @NotNull LocalDateTime validTo,
        Integer usageLimit,
        int perUserLimit
) {}
