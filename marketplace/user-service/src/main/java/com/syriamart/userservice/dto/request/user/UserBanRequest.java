package com.syriamart.userservice.dto.request.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserBanRequest(
        @NotNull String userId,
        @NotNull Boolean banned,
        @Size(max = 500) String reason) {
}
