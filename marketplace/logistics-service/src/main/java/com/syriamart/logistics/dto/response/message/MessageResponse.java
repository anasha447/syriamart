package com.syriamart.logistics.dto.response.message;

import java.time.LocalDateTime;

public record MessageResponse(
        String id, String senderId, String senderRole,
        String receiverId, String receiverRole,
        String orderId, String content,
        boolean read, LocalDateTime createdAt,
        String attachmentUrl
) {}
