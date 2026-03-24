package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.response.dashboard.*;
import com.syriamart.commercial.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AnalyticsService analyticsService;

    // ── Seller ────────────────────────────────────────────────────────────────

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<SellerDashboardResponse> sellerDashboard(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(analyticsService.getSellerDashboard(user.getUsername()));
    }

    @GetMapping("/seller/analytics")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<SellerAnalyticsResponse>> sellerHistory(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(analyticsService.getSellerHistoricAnalytics(user.getUsername()));
    }

    @GetMapping("/seller/analytics/{year}/{month}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<SellerAnalyticsResponse> sellerMonthly(
            @PathVariable int year, @PathVariable int month,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(
                analyticsService.getSellerMonthlyAnalytics(user.getUsername(), year, month));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> adminDashboard() {
        return ResponseEntity.ok(analyticsService.getAdminDashboard());
    }

    @GetMapping("/admin/analytics/{year}/{month}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlatformAnalyticsResponse> platformMonthly(
            @PathVariable int year, @PathVariable int month) {
        return ResponseEntity.ok(analyticsService.getPlatformMonthlyAnalytics(year, month));
    }

    @GetMapping("/admin/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevenueBreakdownResponse> revenue(
            @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(analyticsService.getRevenueBreakdown(months));
    }

    @GetMapping("/admin/top-sellers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SellerListResponse>> topSellers(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getTopSellers(limit));
    }
}
