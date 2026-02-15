package com.syriamart.userservice.controller;

import com.syriamart.common.security.JwtUtils;
import com.syriamart.userservice.dto.request.address.AddressCreateRequest;
import com.syriamart.userservice.dto.request.address.AddressUpdateRequest;
import com.syriamart.userservice.dto.response.address.AddressResponse;
import com.syriamart.userservice.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Slf4j
public class AddressController {

    private final AddressService addressService;
    private final JwtUtils jwtUtils;

    @PostMapping("/")
    public ResponseEntity<AddressResponse> createAddress(@Valid @RequestBody AddressCreateRequest request,
                                                         HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.createAddress(userId, request));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(@PathVariable String addressId,
                                                         @Valid @RequestBody AddressUpdateRequest request,
                                                         HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(addressService.updateAddress(addressId, userId, request));
    }

    @GetMapping("/")
    public ResponseEntity<List<AddressResponse>> getUserAddresses(HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(addressService.getUserAddresses(userId));
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
