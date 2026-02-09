package com.syriamart.logistics.dto.request.fulfillment;

import jakarta.validation.constraints.*;

public record ScanInboundRequest(@NotBlank String qrContent, @NotBlank String warehouseId, String shelfLocation) {
}
