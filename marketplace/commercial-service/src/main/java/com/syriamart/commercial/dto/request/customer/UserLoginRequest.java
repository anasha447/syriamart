package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.*;

public record UserLoginRequest(@NotBlank @Email String email, @NotBlank String password) {
}
