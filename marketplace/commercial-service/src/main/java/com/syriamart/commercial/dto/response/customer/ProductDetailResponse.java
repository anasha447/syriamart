package com.syriamart.commercial.dto.response.customer;

import com.syriamart.commercial.dto.response.seller.ProductImageResponse;
import com.syriamart.commercial.dto.response.seller.ProductVariationResponse;
import java.math.BigDecimal;
import java.util.List;

public record ProductDetailResponse(String id, String name, String description, String categoryName, BigDecimal price,
        BigDecimal originalPrice, int stock, String mainImageUrl, List<ProductImageResponse> images,
        List<ProductVariationResponse> variations, Double averageRating, int reviewCount,
        List<ReviewSummaryResponse> topReviews, String sellerName, String sellerId) {
}
