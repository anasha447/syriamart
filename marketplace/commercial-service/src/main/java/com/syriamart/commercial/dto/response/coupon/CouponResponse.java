package com.syriamart.commercial.dto.response.coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CouponResponse(String id, String code, String description, String discountType, BigDecimal value,
        BigDecimal minOrderAmount, int maxUses, int uses, LocalDateTime startDate, LocalDateTime endDate,
        boolean active) {
}
