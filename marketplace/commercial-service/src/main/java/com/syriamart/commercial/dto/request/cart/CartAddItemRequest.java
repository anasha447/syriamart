package com.syriamart.commercial.dto.request.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CartAddItemRequest(
        @NotBlank String productId,
        String variationValueId,
        @Min(1) int quantity
) {}
