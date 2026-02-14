package com.syriamart.commercial.dto.response.admin;

public record AuthenticationResponse(
        String accessToken,
        String email,
        String role,
        String userId
) {}