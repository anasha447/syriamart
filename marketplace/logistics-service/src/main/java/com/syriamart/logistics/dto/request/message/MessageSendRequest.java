package com.syriamart.logistics.dto.request.message;

import jakarta.validation.constraints.NotBlank;

public record MessageSendRequest(
        @NotBlank String receiverId,
        @NotBlank String receiverRole,
        String orderId,
        @NotBlank String content,
        String attachmentUrl
) {}
