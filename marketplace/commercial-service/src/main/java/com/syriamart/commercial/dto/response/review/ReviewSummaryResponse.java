package com.syriamart.commercial.dto.response.review;

import java.time.LocalDateTime;

public record ReviewSummaryResponse(String userName, int rating, String comment, LocalDateTime createdAt) {
}
