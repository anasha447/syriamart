package com.syriamart.userservice.controller;

import com.syriamart.userservice.dto.request.seller.SellerRegistrationRequest;
import com.syriamart.userservice.dto.request.user.UserLoginRequest;
import com.syriamart.userservice.dto.request.user.UserRegistrationRequest;
import com.syriamart.userservice.dto.response.auth.AuthenticationResponse;
import com.syriamart.userservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody UserLoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register/customer")
    public ResponseEntity<String> registerCustomer(@Valid @RequestBody UserRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerCustomer(request));
    }

    @PostMapping("/register/seller")
    public ResponseEntity<String> registerSeller(@Valid @RequestBody SellerRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerSeller(request));
    }
}
