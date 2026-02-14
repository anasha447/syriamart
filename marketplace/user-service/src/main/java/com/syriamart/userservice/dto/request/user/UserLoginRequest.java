package com.syriamart.userservice.dto.request.user;

import jakarta.validation.constraints.*;

public record UserLoginRequest(@NotBlank @Email String email, @NotBlank String password) {
}
