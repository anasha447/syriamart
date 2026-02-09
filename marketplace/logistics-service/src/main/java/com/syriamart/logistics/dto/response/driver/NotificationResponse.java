package com.syriamart.logistics.dto.response.driver;

import java.time.LocalDateTime;

public record NotificationResponse(String id, String title, String message, String type, boolean read,
        LocalDateTime createdAt) {
}
