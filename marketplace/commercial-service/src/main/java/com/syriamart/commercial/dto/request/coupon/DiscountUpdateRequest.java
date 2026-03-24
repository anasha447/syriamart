package com.syriamart.commercial.dto.request.coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DiscountUpdateRequest(
        String name,
        BigDecimal discountValue,
        LocalDateTime validFrom,
        LocalDateTime validTo,
        Boolean active
) {}
