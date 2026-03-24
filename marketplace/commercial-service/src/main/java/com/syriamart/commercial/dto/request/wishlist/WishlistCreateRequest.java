package com.syriamart.commercial.dto.request.wishlist;

import jakarta.validation.constraints.NotBlank;

public record WishlistCreateRequest(
        @NotBlank String name
) {}
