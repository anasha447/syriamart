package com.syriamart.commercial.dto.response.customer;

import java.time.LocalDateTime;

public record ReviewSummaryResponse(String userName, int rating, String comment, LocalDateTime createdAt) {
}
