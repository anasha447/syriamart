package com.syriamart.commercial.dto.request.seller;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DiscountUpdateRequest(BigDecimal value, LocalDateTime endDate, Boolean active) {
}
