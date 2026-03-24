package com.syriamart.commercial.dto.request.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ProductVariationRequest(
        @NotBlank String name,
        int displayOrder,
        @NotEmpty List<VariationOptionRequest> options
) {}
