package com.syriamart.commercial.dto.request.seller;

import jakarta.validation.constraints.NotBlank;

public record ProductImageRequest(@NotBlank String imageUrl, boolean isMain) {
}
