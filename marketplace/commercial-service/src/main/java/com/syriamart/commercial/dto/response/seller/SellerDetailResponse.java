package com.syriamart.commercial.dto.response.seller;

public record SellerDetailResponse(
        String sellerId, String storeName,
        long totalProducts, double averageRating,
        long totalReviews, String storeImageUrl
) {}
