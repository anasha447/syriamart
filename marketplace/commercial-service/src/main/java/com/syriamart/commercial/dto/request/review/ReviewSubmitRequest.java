package com.syriamart.commercial.dto.request.review;

import jakarta.validation.constraints.*;

public record ReviewSubmitRequest(
        @NotBlank String orderItemId,
        @Min(1) @Max(5) int rating,
        @Size(max = 2000) String comment
) {}
