package com.syriamart.commercial.dto.request.order;

import com.syriamart.commercial.model.enums.OrderItemStatus;
import jakarta.validation.constraints.NotNull;

public record OrderUpdateStatusRequest(
        @NotNull OrderItemStatus status,
        String sellerNote
) {}
