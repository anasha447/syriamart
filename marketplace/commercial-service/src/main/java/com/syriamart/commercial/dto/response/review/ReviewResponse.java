package com.syriamart.commercial.dto.response.review;

import java.time.LocalDateTime;

public record ReviewResponse(
        String id, String productId, String customerId,
        int rating, String comment,
        boolean verifiedPurchase, String sellerReply,
        LocalDateTime createdAt
) {}
