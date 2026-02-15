package com.syriamart.logistics.dto.request.message;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MessageSendRequest(@NotNull String orderId, @NotNull String receiverId,
        @NotBlank @Size(max = 2000) String content) {
}
