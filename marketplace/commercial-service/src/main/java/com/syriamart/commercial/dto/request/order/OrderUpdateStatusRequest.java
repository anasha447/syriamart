package com.syriamart.commercial.dto.request.order;

import jakarta.validation.constraints.*;

public record OrderUpdateStatusRequest(@NotNull String orderId,
        @NotNull @Pattern(regexp = "pending|paid|processing|shipped|delivered|cancelled|refunded") String newStatus,
        @Size(max = 500) String note) {
}
