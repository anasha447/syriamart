package com.syriamart.commercial.dto.request.wishlist;

import jakarta.validation.constraints.*;

public record WishlistCreateRequest(@NotBlank @Size(max = 100) String name) {
}
