package com.syriamart.commercial.dto.response.customer;

import java.math.BigDecimal;

public record ProductCatalogResponse(String id, String name, String categoryName, BigDecimal price,
        BigDecimal originalPrice, String discountLabel, String mainImageUrl, Double averageRating, int reviewCount,
        boolean inStock, String sellerName) {
}
