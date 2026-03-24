package com.syriamart.commercial.dto.request.coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CouponUpdateRequest(
        String description,
        BigDecimal minOrderAmount,
        BigDecimal maxDiscountAmount,
        LocalDateTime validFrom,
        LocalDateTime validTo,
        Integer usageLimit,
        Boolean active
) {}
