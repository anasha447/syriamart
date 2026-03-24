package com.syriamart.logistics.dto.response.fulfillment;

import java.util.List;

public record WarehouseDashboardResponse(
        long totalReceived, long processing,
        long readyForDispatch, long dispatched,
        long returnedReceived,
        List<InventoryStatusResponse> recentInbound,
        List<InventoryStatusResponse> pendingDispatch
) {}
