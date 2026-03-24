package com.syriamart.commercial.dto.response.product;

import com.syriamart.commercial.model.enums.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Full product view for the product detail page. */
public record ProductDetailResponse(
        String id, String name, String slug,
        String description, String tags,
        BigDecimal basePrice, int stockQuantity,
        ProductStatus status, String rejectionReason,
        BigDecimal averageRating, int totalReviews, int totalSold,
        String sellerId, String categoryId, String subCategoryId,
        List<ProductImageResponse> images,
        List<ProductVariationResponse> variations,
        LocalDateTime createdAt, LocalDateTime updatedAt
) {}
