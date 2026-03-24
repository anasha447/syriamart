package com.syriamart.commercial.dto.request.cart;

import jakarta.validation.constraints.Min;

public record CartUpdateItemRequest(
        @Min(0) int quantity
) {}
