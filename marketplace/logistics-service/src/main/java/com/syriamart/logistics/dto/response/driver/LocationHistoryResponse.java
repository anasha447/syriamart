package com.syriamart.logistics.dto.response.driver;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LocationHistoryResponse(BigDecimal latitude, BigDecimal longitude, LocalDateTime timestamp,
        Double speed) {
}
