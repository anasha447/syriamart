package com.syriamart.commercial.dto.request.wishlist;

import jakarta.validation.constraints.NotBlank;

public record WishlistAddItemRequest(
        @NotBlank String productId
) {}
