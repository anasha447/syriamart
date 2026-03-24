package com.syriamart.logistics.controller;

import com.syriamart.logistics.dto.request.fulfillment.*;
import com.syriamart.logistics.dto.response.fulfillment.*;
import com.syriamart.logistics.service.FulfillmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fulfillment")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class FulfillmentController {

    private final FulfillmentService fulfillmentService;

    @PostMapping("/inbound")
    public ResponseEntity<InboundSummaryResponse> scanInbound(
            @AuthenticationPrincipal UserDetails staff,
            @Valid @RequestBody ScanInboundRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fulfillmentService.scanInbound(staff.getUsername(), req));
    }

    @PostMapping("/outbound")
    public ResponseEntity<OutboundSummaryResponse> scanOutbound(
            @AuthenticationPrincipal UserDetails staff,
            @Valid @RequestBody ScanOutboundRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fulfillmentService.scanOutbound(staff.getUsername(), req));
    }

    @GetMapping("/inventory/{orderId}")
    public ResponseEntity<InventoryStatusResponse> checkInventory(@PathVariable String orderId) {
        return ResponseEntity.ok(fulfillmentService.checkInventory(orderId));
    }

    @PostMapping("/inventory/bulk")
    public ResponseEntity<List<InventoryStatusResponse>> checkBulk(
            @Valid @RequestBody InventoryCheckRequest req) {
        return ResponseEntity.ok(fulfillmentService.checkBulkInventory(req));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<WarehouseDashboardResponse> dashboard() {
        return ResponseEntity.ok(fulfillmentService.getWarehouseDashboard());
    }

    @PostMapping("/assign")
    public ResponseEntity<Void> assignDriver(
            @RequestParam String orderId,
            @RequestParam String driverId) {
        fulfillmentService.assignDriverToOrder(orderId, driverId);
        return ResponseEntity.noContent().build();
    }
}
