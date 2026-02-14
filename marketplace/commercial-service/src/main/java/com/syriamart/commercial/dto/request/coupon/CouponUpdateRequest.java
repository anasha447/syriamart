package com.syriamart.commercial.dto.request.coupon;

import java.time.LocalDateTime;

public record CouponUpdateRequest(Integer maxUses, LocalDateTime endDate, Boolean active) {
}
