package com.syriamart.logistics.dto.response.fulfillment;

public record WarehouseDashboardResponse(int packagesInbound, int packagesOutbound, int pendingDispatch,
        int activeDrivers) {
}
