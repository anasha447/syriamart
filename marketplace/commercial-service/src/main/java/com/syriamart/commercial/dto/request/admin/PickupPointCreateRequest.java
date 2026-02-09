package com.syriamart.commercial.dto.request.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PickupPointCreateRequest(
        @NotBlank @Size(max = 200) String name,
        @NotNull String addressId,
        String sellerId, // Optional: null for admin-managed points
        String adminId) {
}
