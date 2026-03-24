package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.wishlist.WishlistAddItemRequest;
import com.syriamart.commercial.dto.request.wishlist.WishlistCreateRequest;
import com.syriamart.commercial.dto.response.wishlist.WishlistResponse;
import com.syriamart.commercial.service.WishlistService;
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
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getAll(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(wishlistService.getMyWishlists(user.getUsername()));
    }

    @GetMapping("/default")
    public ResponseEntity<WishlistResponse> getDefault(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(wishlistService.getOrCreateDefault(user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<WishlistResponse> create(
            @Valid @RequestBody WishlistCreateRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(wishlistService.createWishlist(user.getUsername(), request));
    }

    @PostMapping("/{wishlistId}/items")
    public ResponseEntity<WishlistResponse> addItem(
            @PathVariable String wishlistId,
            @Valid @RequestBody WishlistAddItemRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(wishlistService.addItem(user.getUsername(), wishlistId, request));
    }

    @DeleteMapping("/{wishlistId}/items/{productId}")
    public ResponseEntity<WishlistResponse> removeItem(
            @PathVariable String wishlistId,
            @PathVariable String productId,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(wishlistService.removeItem(user.getUsername(), wishlistId, productId));
    }

    @PostMapping("/{wishlistId}/move-to-cart")
    public ResponseEntity<Void> moveToCart(
            @PathVariable String wishlistId,
            @AuthenticationPrincipal UserDetails user) {
        wishlistService.moveToCart(user.getUsername(), wishlistId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<Void> deleteWishlist(
            @PathVariable String wishlistId,
            @AuthenticationPrincipal UserDetails user) {
        wishlistService.deleteWishlist(user.getUsername(), wishlistId);
        return ResponseEntity.noContent().build();
    }
}
