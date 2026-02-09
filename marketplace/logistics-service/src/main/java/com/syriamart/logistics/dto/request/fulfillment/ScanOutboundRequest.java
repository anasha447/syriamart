package com.syriamart.logistics.dto.request.fulfillment;

import jakarta.validation.constraints.*;

public record ScanOutboundRequest(@NotBlank String qrContent, @NotBlank String driverId) {
}
