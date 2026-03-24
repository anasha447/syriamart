package com.syriamart.logistics.dto.request.fulfillment;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record InventoryCheckRequest(
        @NotEmpty List<String> orderIds
) {}
