package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.*;

public record WishlistCreateRequest(@NotBlank @Size(max = 100) String name) {
}
