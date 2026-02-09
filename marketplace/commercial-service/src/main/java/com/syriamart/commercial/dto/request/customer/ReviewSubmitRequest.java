package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.*;

public record ReviewSubmitRequest(@NotNull String orderId, @NotNull String productId,
        @NotNull @Min(1) @Max(5) Integer rating, @Size(max = 1000) String comment) {
}
