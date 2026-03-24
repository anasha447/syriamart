package com.syriamart.logistics.service.impl;

import com.syriamart.common.event.OrderScannedEvent;
import com.syriamart.common.exception.ResourceNotFoundException;
import com.syriamart.common.model.enums.OrderStatus;
import com.syriamart.logistics.dto.request.fulfillment.*;
import com.syriamart.logistics.dto.response.fulfillment.*;
import com.syriamart.logistics.mapper.FulfillmentMapper;
import com.syriamart.logistics.model.*;
import com.syriamart.logistics.model.enums.ScanEventType;
import com.syriamart.logistics.repository.*;
import com.syriamart.logistics.service.FulfillmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FulfillmentServiceImpl implements FulfillmentService {

    private final WarehouseInventoryRepository  inventoryRepo;
    private final ScanEventRepository           scanEventRepo;
    private final OrderStatusHistoryRepository  historyRepo;
    private final DeliveryProfileRepository     driverRepo;
    private final FulfillmentMapper             fulfillmentMapper;
    private final ApplicationEventPublisher     eventPublisher;

    // ── INBOUND SCAN ──────────────────────────────────────────────────────────

    /**
     * Called by warehouse staff when a package arrives from the seller.
     * Creates a WarehouseInventory record + INBOUND scan event.
     */
    @Override
    public InboundSummaryResponse scanInbound(String staffId, ScanInboundRequest req) {
        if (inventoryRepo.existsByOrderId(req.orderId())) {
            throw new IllegalStateException("Order " + req.orderId() + " is already registered in the warehouse.");
        }

        // 1. Record the scan event
        ScanEvent scan = scanEventRepo.save(ScanEvent.builder()
                .orderId(req.orderId())
                .eventType(ScanEventType.INBOUND_WAREHOUSE)
                .location("Warehouse — inbound")
                .scanCode(req.scanCode())
                .notes(req.notes())
                .scannedAt(LocalDateTime.now())
                .build());

        // 2. Create warehouse inventory entry
        WarehouseInventory inv = WarehouseInventory.builder()
                .orderId(req.orderId())
                .sellerId(req.sellerId())
                .status(WarehouseInventory.WarehouseStatus.RECEIVED)
                .binLocation(req.binLocation())
                .inboundScanEventId(scan.getId())
                .receivedAt(LocalDateTime.now())
                .notes(req.notes())
                .build();
        inventoryRepo.save(inv);

        // 3. Append history
        appendHistory(req.orderId(), null, OrderStatus.PROCESSING, "WAREHOUSE_STAFF", staffId,
                "Package received at warehouse", scan.getId());

        // 4. Publish event
        eventPublisher.publishEvent(
                new OrderScannedEvent(req.orderId(), staffId, OrderStatus.PROCESSING, "Warehouse — inbound"));

        log.info("Inbound scan: order={} bin={} staff={}", req.orderId(), req.binLocation(), staffId);

        return new InboundSummaryResponse(
                req.orderId(), req.sellerId(), req.binLocation(),
                scan.getId(), inv.getReceivedAt(), req.notes());
    }

    // ── OUTBOUND SCAN ─────────────────────────────────────────────────────────

    /**
     * Called when a driver picks up a package from the warehouse for delivery.
     */
    @Override
    public OutboundSummaryResponse scanOutbound(String staffId, ScanOutboundRequest req) {
        WarehouseInventory inv = inventoryRepo.findByOrderId(req.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("WarehouseInventory", req.orderId()));

        if (inv.getStatus() == WarehouseInventory.WarehouseStatus.DISPATCHED) {
            throw new IllegalStateException("Order " + req.orderId() + " has already been dispatched.");
        }

        // Validate driver exists
        driverRepo.findById(req.driverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver", req.driverId()));

        // 1. Scan event
        ScanEvent scan = scanEventRepo.save(ScanEvent.builder()
                .orderId(req.orderId())
                .driverId(req.driverId())
                .eventType(ScanEventType.OUTBOUND_WAREHOUSE)
                .location("Warehouse — outbound")
                .scanCode(req.scanCode())
                .notes(req.notes())
                .scannedAt(LocalDateTime.now())
                .build());

        // 2. Update inventory
        inv.setStatus(WarehouseInventory.WarehouseStatus.DISPATCHED);
        inv.setAssignedDriverId(req.driverId());
        inv.setDispatchedAt(LocalDateTime.now());
        inv.setOutboundScanEventId(scan.getId());
        inventoryRepo.save(inv);

        // 3. History
        appendHistory(req.orderId(), OrderStatus.PROCESSING, OrderStatus.SHIPPED,
                "WAREHOUSE_STAFF", staffId, "Dispatched to driver: " + req.driverId(), scan.getId());

        // 4. Event
        eventPublisher.publishEvent(
                new OrderScannedEvent(req.orderId(), req.driverId(), OrderStatus.SHIPPED, "Warehouse — outbound"));

        log.info("Outbound scan: order={} driver={} staff={}", req.orderId(), req.driverId(), staffId);
        return new OutboundSummaryResponse(req.orderId(), req.driverId(), scan.getId(), inv.getDispatchedAt());
    }

    // ── INVENTORY CHECKS ──────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public InventoryStatusResponse checkInventory(String orderId) {
        WarehouseInventory inv = inventoryRepo.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("WarehouseInventory", orderId));
        return new InventoryStatusResponse(
                inv.getOrderId(), inv.getStatus(), inv.getBinLocation(),
                inv.getAssignedDriverId(), inv.getReceivedAt(), inv.getDispatchedAt());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryStatusResponse> checkBulkInventory(InventoryCheckRequest req) {
        return req.orderIds().stream().map(id ->
                inventoryRepo.findByOrderId(id)
                        .map(inv -> new InventoryStatusResponse(
                                inv.getOrderId(), inv.getStatus(), inv.getBinLocation(),
                                inv.getAssignedDriverId(), inv.getReceivedAt(), inv.getDispatchedAt()))
                        .orElse(new InventoryStatusResponse(id, null, null, null, null, null)))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public WarehouseDashboardResponse getWarehouseDashboard() {
        long received    = inventoryRepo.countByStatus(WarehouseInventory.WarehouseStatus.RECEIVED);
        long processing  = inventoryRepo.countByStatus(WarehouseInventory.WarehouseStatus.PROCESSING);
        long ready       = inventoryRepo.countByStatus(WarehouseInventory.WarehouseStatus.READY_FOR_DISPATCH);
        long dispatched  = inventoryRepo.countByStatus(WarehouseInventory.WarehouseStatus.DISPATCHED);
        long returned    = inventoryRepo.countByStatus(WarehouseInventory.WarehouseStatus.RETURNED_RECEIVED);

        List<InventoryStatusResponse> recentInbound = fulfillmentMapper.toStatusList(
                inventoryRepo.findByStatus(WarehouseInventory.WarehouseStatus.RECEIVED,
                        PageRequest.of(0, 10)).getContent());
        List<InventoryStatusResponse> pendingDispatch = fulfillmentMapper.toStatusList(
                inventoryRepo.findByStatus(WarehouseInventory.WarehouseStatus.READY_FOR_DISPATCH,
                        PageRequest.of(0, 20)).getContent());

        return new WarehouseDashboardResponse(
                received, processing, ready, dispatched, returned,
                recentInbound, pendingDispatch);
    }

    @Override
    public void assignDriverToOrder(String orderId, String driverId) {
        WarehouseInventory inv = inventoryRepo.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("WarehouseInventory", orderId));
        driverRepo.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", driverId));
        inv.setAssignedDriverId(driverId);
        inv.setStatus(WarehouseInventory.WarehouseStatus.READY_FOR_DISPATCH);
        inventoryRepo.save(inv);
        log.info("Driver {} assigned to order {}", driverId, orderId);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void appendHistory(String orderId, OrderStatus prev, OrderStatus next,
                                String role, String actorId, String notes, String scanId) {
        historyRepo.save(OrderStatusHistory.builder()
                .orderId(orderId)
                .previousStatus(prev)
                .newStatus(next)
                .changedByRole(role)
                .changedById(actorId)
                .notes(notes)
                .scanEventId(scanId)
                .changedAt(LocalDateTime.now())
                .build());
    }
}
