package com.syriamart.logistics.dto.request.fulfillment;

import jakarta.validation.constraints.NotBlank;

public record ScanInboundRequest(
        @NotBlank String orderId,
        @NotBlank String scanCode,
        @NotBlank String sellerId,
        String binLocation,
        String notes
) {}
