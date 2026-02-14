package com.syriamart.commercial.controller;

import com.syriamart.commercial.dto.response.admin.AuthenticationResponse;
import com.syriamart.commercial.service.AuthService.Auth; // Import your service class
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final Auth authService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody Map<String, String> loginRequest) {
        // Call the service which now returns the full object
        AuthenticationResponse response = authService.login(
                loginRequest.get("email"),
                loginRequest.get("password")
        );

        return ResponseEntity.ok(response);
    }
}