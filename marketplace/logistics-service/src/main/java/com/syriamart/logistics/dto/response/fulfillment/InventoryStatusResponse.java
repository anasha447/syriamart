package com.syriamart.logistics.dto.response.fulfillment;

public record InventoryStatusResponse(String productId, String warehouseId, int quantityOnHand, String shelfLocation) {
}
