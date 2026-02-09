package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.*;

public record AddressCreateRequest(@NotBlank @Size(max = 200) String addressLine1, @Size(max = 200) String addressLine2,
        @NotBlank @Size(max = 100) String city, @NotBlank @Size(max = 100) String state,
        @NotBlank @Size(max = 20) String postalCode, @NotBlank @Size(max = 100) String country,
        @Pattern(regexp = "home|work") String type) {
}
