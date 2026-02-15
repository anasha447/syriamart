package com.syriamart.commercial.dto.request.coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DiscountUpdateRequest(BigDecimal value, LocalDateTime endDate, Boolean active) {
}
