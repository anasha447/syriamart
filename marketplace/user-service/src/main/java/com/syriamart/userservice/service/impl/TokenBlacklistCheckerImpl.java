package com.syriamart.userservice.service.impl;

import com.syriamart.common.security.TokenBlacklistChecker;
import com.syriamart.userservice.repository.TokenBlacklistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * user-service REAL implementation of TokenBlacklistChecker.
 *
 * This is the bean that gets injected into JwtAuthenticationFilter
 * ONLY inside user-service. It queries the TokenBlacklist table in the DB.
 *
 * When a user calls POST /api/auth/logout, AuthServiceImpl stores the
 * raw token string in the TokenBlacklist table. From that point on,
 * every request carrying that token is rejected here — even though the
 * JWT signature is still cryptographically valid.
 *
 * Place this file in:
 *   user-service/src/main/java/com/syriamart/userservice/security/
 */
@Component
@RequiredArgsConstructor
public class TokenBlacklistCheckerImpl implements TokenBlacklistChecker {

    private final TokenBlacklistRepository tokenBlacklistRepository;

    @Override
    public boolean isBlacklisted(String token) {
        // Returns true if this exact token string was previously logged out
        return tokenBlacklistRepository.existsByToken(token);
    }
}
