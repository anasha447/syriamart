package com.syriamart.userservice.dto.response.auth;

public record AuthenticationResponse(
        String accessToken,
        String email,
        String role,
        String userId
) {}
