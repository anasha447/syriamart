package com.syriamart.commercial.dto.response.coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DiscountResponse(String id, String discountType, BigDecimal value, LocalDateTime startDate,
        LocalDateTime endDate, boolean active, String scopeType, String targetName) {
}
