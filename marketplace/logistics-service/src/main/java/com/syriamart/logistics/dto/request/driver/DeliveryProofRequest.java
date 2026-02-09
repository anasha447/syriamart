package com.syriamart.logistics.dto.request.driver;

import jakarta.validation.constraints.*;

public record DeliveryProofRequest(@NotNull String orderId, @NotBlank String proofImageUrl, String customerSignatureUrl,
        String recipientName, String note) {
}
