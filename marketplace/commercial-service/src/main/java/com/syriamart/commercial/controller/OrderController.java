package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.order.CheckoutRequest;
import com.syriamart.commercial.dto.request.order.OrderUpdateStatusRequest;
import com.syriamart.commercial.dto.response.order.*;
import com.syriamart.commercial.service.OrderService;
import com.syriamart.common.model.enums.OrderStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ── Customer ──────────────────────────────────────────────────────────────

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CheckoutSummaryResponse> checkout(
            @Valid @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(orderService.checkout(user.getUsername(), request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderListResponse>> myOrders(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.findMyOrders(user.getUsername(),
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @GetMapping("/my/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDetailResponse> myOrderById(
            @PathVariable String orderId,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.findByIdForCustomer(orderId, user.getUsername()));
    }

    @PostMapping("/my/{orderId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable String orderId,
            @AuthenticationPrincipal UserDetails user) {
        orderService.cancelOrder(orderId, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    // ── Seller ────────────────────────────────────────────────────────────────

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<OrderSellerViewResponse>> sellerOrders(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.findOrdersForSeller(user.getUsername(),
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @PatchMapping("/seller/items/{orderItemId}/status")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<OrderStatusEventResponse> updateItemStatus(
            @PathVariable String orderItemId,
            @Valid @RequestBody OrderUpdateStatusRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(
                orderService.updateItemStatus(orderItemId, user.getUsername(), request));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderListResponse>> allOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.findAllOrders(status,
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @PatchMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminUpdateStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus status) {
        orderService.adminUpdateOrderStatus(orderId, status);
        return ResponseEntity.noContent().build();
    }
}
