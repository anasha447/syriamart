package com.syriamart.userservice.controller;

import com.syriamart.common.security.JwtUtils;
import com.syriamart.userservice.dto.request.user.UserBanRequest;
import com.syriamart.userservice.dto.request.user.UserProfileUpdateRequest;
import com.syriamart.userservice.dto.response.user.UserProfileResponse;
import com.syriamart.userservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('DRIVER')")
    public ResponseEntity<UserProfileResponse> updateUserProfile(@Valid @RequestBody UserProfileUpdateRequest request,
                                                                 HttpServletRequest httpRequest) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(userService.updateUserProfile(userId, request));
    }

    @PostMapping("/{userId}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> banUser(@PathVariable String userId,
                                        @Valid @RequestBody UserBanRequest request) {
        userService.banUser(userId, request);
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
