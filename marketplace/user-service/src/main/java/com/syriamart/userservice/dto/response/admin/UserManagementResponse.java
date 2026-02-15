package com.syriamart.userservice.dto.response.admin;

import java.time.LocalDateTime;

public record UserManagementResponse(String id, String email, String fullName, String phone, boolean isActive,
        LocalDateTime createdAt, LocalDateTime lastLogin) {
}
