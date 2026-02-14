package com.syriamart.commercial.dto.response.product;

import com.syriamart.commercial.dto.response.coupon.DiscountResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductDetailResponse(String id, String name, String description, String categoryId, String categoryName,
        BigDecimal price, int stock, String sku, String status, boolean adminApproved, String mainImageUrl,
        List<ProductImageResponse> images, List<ProductVariationResponse> variations, DiscountResponse activeDiscount,
        Double averageRating, int reviewCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
}
