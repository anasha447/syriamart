package com.syriamart.logistics.dto.response.message;

import java.time.LocalDateTime;

public record MessageResponse(String id, String senderId, String senderName, String receiverId, String receiverName,
        String orderId, String content, boolean isRead, LocalDateTime sentAt) {
}
