package com.syriamart.logistics.controller;

import com.syriamart.logistics.model.ReturnRequest;
import com.syriamart.logistics.model.enums.ReturnRequestStatus;
import com.syriamart.logistics.service.ReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService returnService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReturnRequest> createReturn(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam String orderItemId,
            @RequestParam String orderId,
            @RequestParam String reason,
            @RequestParam(required = false) String proofUrl) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(returnService.createReturn(user.getUsername(), orderItemId, orderId, reason, proofUrl));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ReturnRequest>> myReturns(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(returnService.getCustomerReturns(user.getUsername(),
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))));
    }

    @PostMapping("/{returnId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReturnRequest> approve(
            @PathVariable String returnId,
            @AuthenticationPrincipal UserDetails admin,
            @RequestParam BigDecimal refundAmount) {
        return ResponseEntity.ok(returnService.approveReturn(returnId, admin.getUsername(), refundAmount));
    }

    @PostMapping("/{returnId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReturnRequest> reject(
            @PathVariable String returnId,
            @AuthenticationPrincipal UserDetails admin,
            @RequestParam String reason) {
        return ResponseEntity.ok(returnService.rejectReturn(returnId, admin.getUsername(), reason));
    }

    @PostMapping("/{returnId}/assign-driver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReturnRequest> assignDriver(
            @PathVariable String returnId,
            @RequestParam String driverId) {
        return ResponseEntity.ok(returnService.assignDriver(returnId, driverId));
    }

    @PostMapping("/{returnId}/pickup")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ReturnRequest> markPickedUp(
            @PathVariable String returnId,
            @AuthenticationPrincipal UserDetails driver) {
        return ResponseEntity.ok(returnService.markPickedUp(returnId, driver.getUsername()));
    }

    @PostMapping("/{returnId}/warehouse-received")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReturnRequest> markReceived(
            @PathVariable String returnId,
            @AuthenticationPrincipal UserDetails staff) {
        return ResponseEntity.ok(returnService.markReceivedAtWarehouse(returnId, staff.getUsername()));
    }

    @PostMapping("/{returnId}/initiate-refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReturnRequest> initiateRefund(
            @PathVariable String returnId,
            @AuthenticationPrincipal UserDetails admin) {
        return ResponseEntity.ok(returnService.initiateRefund(returnId, admin.getUsername()));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReturnRequest>> byStatus(
            @PathVariable ReturnRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(returnService.getByStatus(status, PageRequest.of(page, size)));
    }
}
