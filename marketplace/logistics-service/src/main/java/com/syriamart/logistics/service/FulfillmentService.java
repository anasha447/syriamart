package com.syriamart.logistics.service;

import com.syriamart.logistics.dto.request.fulfillment.*;
import com.syriamart.logistics.dto.response.fulfillment.*;

import java.util.List;

public interface FulfillmentService {
    InboundSummaryResponse  scanInbound(String staffId, ScanInboundRequest req);
    OutboundSummaryResponse scanOutbound(String staffId, ScanOutboundRequest req);
    InventoryStatusResponse checkInventory(String orderId);
    List<InventoryStatusResponse> checkBulkInventory(InventoryCheckRequest req);
    WarehouseDashboardResponse getWarehouseDashboard();
    void assignDriverToOrder(String orderId, String driverId);
}
