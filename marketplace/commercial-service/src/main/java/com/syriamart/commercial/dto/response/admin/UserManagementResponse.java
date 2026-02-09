package com.syriamart.commercial.dto.response.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record UserManagementResponse(String id, String email, String fullName, String phone, boolean isActive,
        int orderCount, BigDecimal totalSpent, LocalDateTime createdAt, LocalDateTime lastLogin) {
}
