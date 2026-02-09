package com.syriamart.commercial.dto.response.customer;

import java.time.LocalDateTime;

public record ReviewResponse(String id, String productId, String userName, int rating, String comment,
        LocalDateTime createdAt, boolean isApproved) {
}
