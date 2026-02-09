package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.*;

public record CartUpdateItemRequest(@NotNull String cartItemId, @NotNull @Min(0) @Max(999) Integer quantity) {
}
