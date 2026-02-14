package com.syriamart.commercial.dto.request.wishlist;

import jakarta.validation.constraints.NotNull;

public record WishlistAddItemRequest(@NotNull String wishlistId, @NotNull String productId) {
}
