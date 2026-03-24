package com.syriamart.logistics.controller;

import com.syriamart.logistics.dto.request.driver.*;
import com.syriamart.logistics.dto.response.driver.*;
import com.syriamart.logistics.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    // ── Public auth ───────────────────────────────────────────────────────────

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody DriverLoginRequest req) {
        String token = driverService.login(req);
        return ResponseEntity.ok(Map.of("token", token, "type", "Bearer"));
    }

    // ── Driver: self-service (requires ROLE_DRIVER) ───────────────────────────

    @GetMapping("/me")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<DriverProfileResponse> myProfile(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(driverService.getMyProfile(user.getUsername()));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<DriverProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody DriverProfileUpdateRequest req) {
        return ResponseEntity.ok(driverService.updateMyProfile(user.getUsername(), req));
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Void> updateStatus(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody DriverStatusUpdateRequest req) {
        driverService.updateStatus(user.getUsername(), req);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/location")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Void> updateLocation(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody DriverLocationUpdateRequest req) {
        driverService.updateLocation(user.getUsername(), req);
        return ResponseEntity.noContent().build();
    }

    // ── SCAN WORKFLOW — the core delivery endpoints ───────────────────────────

    /**
     * POST /api/driver/scan
     * Driver physically scans a package QR/barcode.
     * Saves ScanEvent → appends OrderStatusHistory → publishes OrderScannedEvent.
     */
    @PostMapping("/scan")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ScanConfirmationResponse> scanPackage(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody ScanPackageRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(driverService.scanPackage(user.getUsername(), req));
    }

    /**
     * POST /api/driver/orders/{orderId}/deliver
     * Final delivery proof submission.
     * Saves DELIVERED scan event → publishes DeliveryCompletedEvent.
     */
    @PostMapping("/orders/{orderId}/deliver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ScanConfirmationResponse> submitDeliveryProof(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String orderId,
            @Valid @RequestBody DeliveryProofRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(driverService.submitDeliveryProof(user.getUsername(), orderId, req));
    }

    // ── Assignments & route ───────────────────────────────────────────────────

    @GetMapping("/orders")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<AssignedOrderResponse>> myOrders(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(driverService.getMyActiveOrders(user.getUsername()));
    }

    @PostMapping("/route/optimize")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<DeliveryRouteResponse> optimizeRoute(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody RouteOptimizationRequest req) {
        return ResponseEntity.ok(driverService.optimizeRoute(user.getUsername(), req));
    }

    // ── Shift management ──────────────────────────────────────────────────────

    @PostMapping("/shift/start")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ShiftSummaryResponse> startShift(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(driverService.startShift(user.getUsername()));
    }

    @PostMapping("/shift/end")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ShiftSummaryResponse> endShift(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(driverService.endShift(user.getUsername()));
    }

    @GetMapping("/shift/current")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ShiftSummaryResponse> currentShift(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(driverService.getCurrentShift(user.getUsername()));
    }

    // ── Dashboard & analytics ─────────────────────────────────────────────────

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<DriverDashboardResponse> dashboard(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(driverService.getMyDashboard(user.getUsername()));
    }

    @GetMapping("/performance")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<DriverPerformanceResponse> performance(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(driverService.getPerformance(user.getUsername()));
    }

    @GetMapping("/payout")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<PayoutResponse> payout(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(driverService.getPayoutInfo(user.getUsername()));
    }
}
