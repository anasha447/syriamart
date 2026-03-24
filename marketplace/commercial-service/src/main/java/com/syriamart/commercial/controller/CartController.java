package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.cart.CartAddItemRequest;
import com.syriamart.commercial.dto.request.cart.CartUpdateItemRequest;
import com.syriamart.commercial.dto.response.cart.CartResponse;
import com.syriamart.commercial.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getOrCreateCart(user.getUsername()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @Valid @RequestBody CartAddItemRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.addItem(user.getUsername(), request));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateItem(
            @PathVariable String cartItemId,
            @Valid @RequestBody CartUpdateItemRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.updateItem(user.getUsername(), cartItemId, request));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeItem(
            @PathVariable String cartItemId,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.removeItem(user.getUsername(), cartItemId));
    }

    @PostMapping("/coupon")
    public ResponseEntity<CartResponse> applyCoupon(
            @RequestParam String code,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.applyCoupon(user.getUsername(), code));
    }

    @DeleteMapping("/coupon")
    public ResponseEntity<CartResponse> removeCoupon(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.removeCoupon(user.getUsername()));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails user) {
        cartService.clearCart(user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
