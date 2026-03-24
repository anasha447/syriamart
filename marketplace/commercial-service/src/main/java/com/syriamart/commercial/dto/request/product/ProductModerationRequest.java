package com.syriamart.commercial.dto.request.product;

import com.syriamart.commercial.model.enums.ProductStatus;
import jakarta.validation.constraints.NotNull;

public record ProductModerationRequest(
        @NotNull ProductStatus status,
        String rejectionReason
) {}
