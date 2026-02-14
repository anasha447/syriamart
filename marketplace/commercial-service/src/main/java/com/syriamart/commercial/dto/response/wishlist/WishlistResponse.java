package com.syriamart.commercial.dto.response.wishlist;

import java.time.LocalDateTime;

public record WishlistResponse(String id, String name, int itemCount, LocalDateTime createdAt) {
}
