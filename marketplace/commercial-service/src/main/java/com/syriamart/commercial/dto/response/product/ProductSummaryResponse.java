package com.syriamart.commercial.dto.response.product;

import com.syriamart.commercial.model.enums.ProductStatus;

import java.math.BigDecimal;

/** Compact card used in listings, search results, and wishlists. */
public record ProductSummaryResponse(
        String id, String name, String slug,
        BigDecimal basePrice, BigDecimal effectivePrice,
        String primaryImageUrl, BigDecimal averageRating,
        int totalReviews, ProductStatus status,
        String categoryId, String sellerId,
        int totalSold
) {}
