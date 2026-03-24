package com.syriamart.logistics.dto.response.fulfillment;

import com.syriamart.logistics.model.WarehouseInventory.WarehouseStatus;

import java.time.LocalDateTime;

public record InventoryStatusResponse(
        String orderId, WarehouseStatus status,
        String binLocation, String assignedDriverId,
        LocalDateTime receivedAt, LocalDateTime dispatchedAt
) {}
