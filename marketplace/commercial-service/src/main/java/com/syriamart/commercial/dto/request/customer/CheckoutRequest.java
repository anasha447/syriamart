package com.syriamart.commercial.dto.request.customer;

import jakarta.validation.constraints.*;

public record CheckoutRequest(@NotNull String deliveryAddressId, String pickupPointId, String couponCode,
        @NotNull @Pattern(regexp = "card|cash|wallet") String paymentMethod, String paymentToken) {
}
