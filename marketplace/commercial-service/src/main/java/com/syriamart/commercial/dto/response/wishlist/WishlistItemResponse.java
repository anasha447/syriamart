package com.syriamart.commercial.dto.response.wishlist;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record WishlistItemResponse(String id, String productId, String productName, BigDecimal price, String imageUrl,
        boolean inStock, LocalDateTime addedAt) {
}
