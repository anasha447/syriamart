package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.*;

public record UserRegistrationRequest(@NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 100) String password, @NotBlank @Size(max = 100) String fullName,
        @Pattern(regexp = "^\\\\+?[1-9]\\\\d{1,14}$") String phone) {
}
