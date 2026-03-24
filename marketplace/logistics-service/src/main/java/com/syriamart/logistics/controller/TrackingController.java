package com.syriamart.logistics.controller;

import com.syriamart.logistics.dto.response.driver.OrderLogisticsDetailResponse;
import com.syriamart.logistics.dto.response.tracking.OrderTrackingResponse;
import com.syriamart.logistics.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    /** Fully public — no JWT required. Customer pastes their order ID. */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderTrackingResponse> track(@PathVariable String orderId) {
        return ResponseEntity.ok(trackingService.trackByOrderId(orderId));
    }

    /** Admin internal view with full logistics detail. */
    @GetMapping("/admin/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderLogisticsDetailResponse> adminDetail(@PathVariable String orderId) {
        return ResponseEntity.ok(trackingService.getAdminDetail(orderId));
    }
}
