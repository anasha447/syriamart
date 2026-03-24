package com.syriamart.logistics.config;

import com.syriamart.common.security.JwtAuthenticationFilter;
import com.syriamart.common.security.JwtUtils;
import com.syriamart.common.security.TokenBlacklistChecker;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Wires shared beans from common-lib.
 *
 * TokenBlacklistChecker — no-op: the logistics-service does not maintain
 * its own blacklist. Tokens are valid if the signature is correct.
 *
 * PasswordEncoder — BCrypt, used for driver password hashing and
 * verification in DriverServiceImpl.
 */
@Configuration
public class SharedBeanConfig {

    @Bean
    public JwtUtils jwtUtils() {
        return new JwtUtils();
    }

    @Bean
    public TokenBlacklistChecker tokenBlacklistChecker() {
        return token -> false; // not blacklisted
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(
            JwtUtils jwtUtils,
            TokenBlacklistChecker checker) {
        return new JwtAuthenticationFilter(jwtUtils, checker);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
