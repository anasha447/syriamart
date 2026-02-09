package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.NotNull;

public record WishlistAddItemRequest(@NotNull String wishlistId, @NotNull String productId) {
}
