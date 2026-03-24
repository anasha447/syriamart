package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.request.coupon.*;
import com.syriamart.commercial.dto.response.coupon.*;
import com.syriamart.commercial.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // ── Public lookup (used by cart validation) ───────────────────────────────

    @GetMapping("/{code}/validate")
    public ResponseEntity<CouponResponse> validate(@PathVariable String code) {
        return ResponseEntity.ok(couponService.findByCode(code));
    }

    // ── Seller Coupons ────────────────────────────────────────────────────────

    @GetMapping("/my")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<CouponResponse>> myCoupons(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(couponService.findForSeller(user.getUsername(),
                PageRequest.of(page, size)));
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<CouponResponse> createSellerCoupon(
            @Valid @RequestBody CouponCreateRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(couponService.createCoupon(user.getUsername(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<CouponResponse> update(
            @PathVariable String id,
            @Valid @RequestBody CouponUpdateRequest request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    // ── Admin Coupons ─────────────────────────────────────────────────────────

    @PostMapping("/admin/platform")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CouponResponse> createPlatformCoupon(
            @Valid @RequestBody CouponCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(couponService.createPlatformCoupon(request));
    }

    @GetMapping("/admin/platform")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CouponResponse>> platformCoupons(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(couponService.findPlatformCoupons(PageRequest.of(page, size)));
    }

    // ── Discounts ─────────────────────────────────────────────────────────────

    @PostMapping("/discounts")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<DiscountResponse> createDiscount(
            @Valid @RequestBody DiscountCreateRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(couponService.createDiscount(user.getUsername(), request));
    }

    @PostMapping("/admin/discounts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DiscountResponse> createPlatformDiscount(
            @Valid @RequestBody DiscountCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(couponService.createPlatformDiscount(request));
    }

    @GetMapping("/product/{productId}/discounts")
    public ResponseEntity<List<DiscountResponse>> productDiscounts(
            @PathVariable String productId) {
        return ResponseEntity.ok(couponService.findActiveForProduct(productId));
    }
}
