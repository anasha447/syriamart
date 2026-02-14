package com.syriamart.commercial.dto.request.cart;

import jakarta.validation.constraints.*;

public record CartAddItemRequest(@NotNull String productId, String variationValueId,
        @NotNull @Min(1) @Max(999) Integer quantity) {
}
