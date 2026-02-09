package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.*;

public record MessageSendRequest(@NotNull String orderId, @NotNull String receiverId,
        @NotBlank @Size(max = 2000) String content) {
}
