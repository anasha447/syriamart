package com.syriamart.logistics.dto.request.fulfillment;

import jakarta.validation.constraints.NotBlank;

public record InventoryCheckRequest(@NotBlank String productId, String warehouseId) {
}
