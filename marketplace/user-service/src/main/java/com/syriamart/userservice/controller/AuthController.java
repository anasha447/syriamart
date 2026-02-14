package com.syriamart.userservice.controller;

import com.syriamart.userservice.dto.request.user.UserLoginRequest;
import com.syriamart.userservice.dto.response.auth.AuthenticationResponse;
import com.syriamart.userservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody @Valid UserLoginRequest loginRequest) {
        AuthenticationResponse response = authService.login(
                loginRequest.email(),
                loginRequest.password()
        );

        return ResponseEntity.ok(response);
    }
}
