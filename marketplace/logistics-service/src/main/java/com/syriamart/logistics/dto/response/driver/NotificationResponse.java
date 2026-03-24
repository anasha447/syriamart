package com.syriamart.logistics.dto.response.driver;

import java.time.LocalDateTime;

public record NotificationResponse(
        String id, String type, String title,
        String body, String orderId,
        boolean read, LocalDateTime createdAt
) {}
