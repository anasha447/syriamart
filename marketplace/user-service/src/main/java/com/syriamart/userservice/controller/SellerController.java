package com.syriamart.userservice.controller;

import com.syriamart.common.security.JwtUtils;
import com.syriamart.userservice.dto.request.seller.SellerApprovalRequest;
import com.syriamart.userservice.dto.request.seller.SellerProfileUpdateRequest;
import com.syriamart.userservice.dto.response.seller.SellerDetailResponse;
import com.syriamart.userservice.service.SellerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sellers")
@RequiredArgsConstructor
@Slf4j
public class SellerController {

    private final SellerService sellerService;
    private final JwtUtils jwtUtils;

    @PutMapping("/profile")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<SellerDetailResponse> updateSellerProfile(@Valid @RequestBody SellerProfileUpdateRequest request,
                                                                    HttpServletRequest httpRequest) {
        String sellerId = extractUserId(httpRequest);
        return ResponseEntity.ok(sellerService.updateSellerProfile(sellerId, request));
    }

    @PostMapping("/{sellerId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveSeller(@PathVariable String sellerId,
                                              @Valid @RequestBody SellerApprovalRequest request) {
        sellerService.approveSeller(sellerId, request);
        return ResponseEntity.ok().build();
    }

    private String extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtils.getUserIdFromToken(token);
        }
        throw new RuntimeException("Missing or invalid Authorization header");
    }
}
