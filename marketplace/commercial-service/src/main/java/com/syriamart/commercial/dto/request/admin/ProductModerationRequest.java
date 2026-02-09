package com.syriamart.commercial.dto.request.admin;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProductModerationRequest(
        @NotNull String productId,
        @NotNull @Pattern(regexp = "active|rejected") String status,
        @Size(max = 1000) String moderationNote) {
}
