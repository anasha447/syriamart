package com.syriamart.common.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String requestURI = request.getRequestURI();

        // 1. Log the Request
        System.out.println("🔍 FILTER: Processing Request to: " + requestURI);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = jwtUtils.validateAndGetClaims(token);
                String email = claims.getSubject();
                String rawRole = claims.get("role", String.class);

                // 2. Log what is inside the token
                System.out.println("✅ FILTER: Token Valid. Email: " + email + ", Raw Role: " + rawRole);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Logic to ensure ROLE_ prefix
                    String finalRole = (rawRole != null && rawRole.startsWith("ROLE_"))
                            ? rawRole
                            : "ROLE_" + rawRole;

                    // 3. Log the final authority we are giving Spring Security
                    System.out.println("🛡️ FILTER: Assigning Authority: " + finalRole);

                    var authority = new SimpleGrantedAuthority(finalRole);
                    var authToken = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.singletonList(authority)
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("🔐 FILTER: Authentication set in Context for: " + email);
                }
            } catch (Exception e) {
                System.out.println("❌ FILTER: Token Validation Failed: " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
        } else {
            System.out.println("⚠️ FILTER: No Valid Bearer Token found.");
        }

        filterChain.doFilter(request, response);
    }
}