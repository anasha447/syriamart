package com.syriamart.commercial.dto.response.review;

import java.time.LocalDateTime;

public record ReviewResponse(String id, String productId, String userName, int rating, String comment,
        LocalDateTime createdAt, boolean isApproved) {
}
