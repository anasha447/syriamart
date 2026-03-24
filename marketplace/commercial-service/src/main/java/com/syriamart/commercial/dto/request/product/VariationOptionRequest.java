package com.syriamart.commercial.dto.request.product;

import jakarta.validation.constraints.NotBlank;

public record VariationOptionRequest(
        @NotBlank String value,
        String colorHex,
        int displayOrder
) {}
