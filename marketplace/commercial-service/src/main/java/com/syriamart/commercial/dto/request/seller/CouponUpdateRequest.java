package com.syriamart.commercial.dto.request.seller;

import java.time.LocalDateTime;

public record CouponUpdateRequest(Integer maxUses, LocalDateTime endDate, Boolean active) {
}
