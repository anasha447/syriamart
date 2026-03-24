package com.syriamart.common.security;

@FunctionalInterface
public interface TokenBlacklistChecker {
    boolean isBlacklisted(String token);
}