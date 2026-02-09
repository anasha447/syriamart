package com.syriamart.commercial.dto.request.seller;

import jakarta.validation.constraints.*;
import java.util.List;

public record ProductVariationRequest(@NotBlank @Size(max = 50) String name,
        @NotEmpty List<VariationOptionRequest> options) {
}
