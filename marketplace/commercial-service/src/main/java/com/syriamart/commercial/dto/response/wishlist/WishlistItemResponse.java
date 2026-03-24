package com.syriamart.commercial.dto.response.wishlist;

import com.syriamart.commercial.dto.response.product.ProductSummaryResponse;

import java.time.LocalDateTime;

public record WishlistItemResponse(
        String id, ProductSummaryResponse product, LocalDateTime addedAt
) {}
