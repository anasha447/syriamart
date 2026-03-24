package com.syriamart.logistics.dto.request.fulfillment;

import jakarta.validation.constraints.NotBlank;

public record ScanOutboundRequest(
        @NotBlank String orderId,
        @NotBlank String driverId,
        @NotBlank String scanCode,
        String notes
) {}
