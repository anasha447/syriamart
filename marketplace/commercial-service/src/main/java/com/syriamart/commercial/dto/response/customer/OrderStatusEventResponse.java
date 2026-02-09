package com.syriamart.commercial.dto.response.customer;

import java.time.LocalDateTime;

public record OrderStatusEventResponse(String status, String note, String changedBy, LocalDateTime changedAt) {
}
