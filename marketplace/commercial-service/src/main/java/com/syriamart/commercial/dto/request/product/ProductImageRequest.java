package com.syriamart.commercial.dto.request.product;

import jakarta.validation.constraints.NotBlank;

public record ProductImageRequest(@NotBlank String imageUrl, boolean isMain) {
}
