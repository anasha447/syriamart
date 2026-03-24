package com.syriamart.logistics.service.impl;

import com.syriamart.common.exception.ResourceNotFoundException;
import com.syriamart.logistics.dto.response.driver.OrderLogisticsDetailResponse;
import com.syriamart.logistics.dto.response.tracking.OrderTrackingResponse;
import com.syriamart.logistics.dto.response.tracking.ScanEventResponse;
import com.syriamart.logistics.model.*;
import com.syriamart.logistics.repository.*;
import com.syriamart.logistics.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TrackingServiceImpl implements TrackingService {

    private final ScanEventRepository          scanEventRepo;
    private final OrderStatusHistoryRepository historyRepo;
    private final WarehouseInventoryRepository inventoryRepo;
    private final DeliveryProfileRepository    driverRepo;

    @Override
    public OrderTrackingResponse trackByOrderId(String orderId) {
        List<ScanEvent> events = scanEventRepo.findByOrderIdOrderByScannedAtAsc(orderId);
        if (events.isEmpty()) {
            throw new ResourceNotFoundException("Tracking info for order", orderId);
        }

        var currentStatus = historyRepo.findTopByOrderIdOrderByChangedAtDesc(orderId)
                .map(OrderStatusHistory::getNewStatus)
                .orElse(com.syriamart.common.model.enums.OrderStatus.PENDING);

        String driverName = inventoryRepo.findByOrderId(orderId)
                .map(WarehouseInventory::getAssignedDriverId)
                .flatMap(driverRepo::findById)
                .map(Driver::getFullName)
                .orElse(null);

        List<ScanEventResponse> timeline = events.stream().map(this::toScanResponse).toList();

        return new OrderTrackingResponse(
                orderId, null, currentStatus, null,
                driverName,
                events.isEmpty() ? null : events.get(events.size() - 1).getScannedAt(),
                timeline);
    }

    @Override
    public OrderTrackingResponse trackByTrackingNumber(String trackingNumber) {
        // Tracking number is set on the Order in commercial-service.
        // In this service we store orderId. The caller (client) must map
        // trackingNumber→orderId via commercial-service or pass orderId directly.
        throw new UnsupportedOperationException(
                "Use trackByOrderId — tracking number resolution requires commercial-service integration.");
    }

    @Override
    public OrderLogisticsDetailResponse getAdminDetail(String orderId) {
        List<ScanEvent> events = scanEventRepo.findByOrderIdOrderByScannedAtAsc(orderId);
        var currentStatus = historyRepo.findTopByOrderIdOrderByChangedAtDesc(orderId)
                .map(OrderStatusHistory::getNewStatus)
                .orElse(com.syriamart.common.model.enums.OrderStatus.PENDING);

        String driverId = inventoryRepo.findByOrderId(orderId)
                .map(WarehouseInventory::getAssignedDriverId).orElse(null);

        return new OrderLogisticsDetailResponse(
                orderId, currentStatus,
                null, null, null, null, null,
                null, driverId,
                events.stream().map(this::toScanResponse).toList());
    }

    private ScanEventResponse toScanResponse(ScanEvent e) {
        return new ScanEventResponse(e.getId(), e.getOrderId(),
                e.getEventType(), e.getLocation(),
                e.getLatitude(), e.getLongitude(),
                e.getNotes(), e.getScannedAt());
    }
}
