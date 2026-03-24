package com.syriamart.userservice.service.impl;

import com.syriamart.common.model.enums.UserRole;
import com.syriamart.common.security.JwtUtils;
import com.syriamart.userservice.dto.request.seller.SellerRegistrationRequest;
import com.syriamart.userservice.dto.request.user.UserLoginRequest;
import com.syriamart.userservice.dto.request.user.UserRegistrationRequest;
import com.syriamart.userservice.dto.response.auth.AuthenticationResponse;
import com.syriamart.userservice.model.Admin;
import com.syriamart.userservice.model.Seller;
import com.syriamart.userservice.model.TokenBlacklist;
import com.syriamart.userservice.model.User;
import com.syriamart.userservice.model.enums.SellerStatus;
import com.syriamart.userservice.repository.AdminRepository;
import com.syriamart.userservice.repository.SellerRepository;
import com.syriamart.userservice.repository.TokenBlacklistRepository;
import com.syriamart.userservice.repository.UserRepository;
import com.syriamart.userservice.service.AuthService;
import io.jsonwebtoken.ExpiredJwtException; // Cleaned up import
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date; // Cleaned up import

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final AdminRepository adminRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    @Override
    public AuthenticationResponse login(UserLoginRequest request) {
        log.info("Login attempt for email: {}", request.email());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("UNKNOWN");

        String userId = fetchUserIdByEmailAndRole(email, role);

        String token = jwtUtils.generateToken(email, role, userId);

        return new AuthenticationResponse(token, email, role, userId);
    }

    @Override
    @Transactional
    public String registerCustomer(UserRegistrationRequest request) {
        log.info("Registering customer: {}", request.email());
        checkEmailUniqueness(request.email());

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .phone(request.phone())
                .role(UserRole.CUSTOMER)
                .isActive(true)
                .build();

        userRepository.save(user);
        return "Customer registered successfully";
    }

    @Override
    @Transactional
    public String registerSeller(SellerRegistrationRequest request) {
        log.info("Registering seller: {}", request.email());
        checkEmailUniqueness(request.email());

        Seller seller = Seller.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .name(request.fullName())
                .phone(request.phone())
                .storeName(request.storeName())
                .storeLocation(request.storeLocation())
                .productType(request.productType())
                .status(SellerStatus.PENDING_APPROVAL)
                .adminApproved(false)
                .build();

        sellerRepository.save(seller);
        return "Seller registered successfully. Pending approval.";
    }

    private void checkEmailUniqueness(String email) {
        if (userRepository.findByEmail(email).isPresent() ||
                sellerRepository.findByEmail(email).isPresent() ||
                adminRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists: " + email);
        }
    }

    private String fetchUserIdByEmailAndRole(String email, String role) {
        if ("ADMIN".equals(role)) {
            return adminRepository.findByEmail(email).map(Admin::getId).orElseThrow();
        } else if ("SELLER".equals(role)) {
            return sellerRepository.findByEmail(email).map(Seller::getId).orElseThrow();
        } else {
            return userRepository.findByEmail(email).map(User::getId).orElseThrow();
        }
    }

    @Override
    @Transactional
    public void logout(String token) {
        log.info("Processing logout for token...");

        // 1. Remove the "Bearer " prefix if the controller passed it
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 2. Only blacklist it if it's not already in the database
        if (token != null && !tokenBlacklistRepository.existsByToken(token)) {
            try {
                // Try to get the expiration date normally
                Date expirationDate = jwtUtils.getExpirationDateFromToken(token);
                LocalDateTime localExpiry = expirationDate.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime();

                TokenBlacklist blacklistedToken = TokenBlacklist.builder()
                        .token(token)
                        .expiryDate(localExpiry)
                        .build();

                tokenBlacklistRepository.save(blacklistedToken);
                log.info("Token successfully blacklisted. User is logged out.");

            } catch (ExpiredJwtException e) {
                // If it's already expired, we don't even need to blacklist it!
                // The JwtAuthenticationFilter will reject it anyway.
                log.info("Token is already expired naturally. No need to blacklist.");
            } catch (Exception e) {
                // Catch any other malformed token errors
                log.error("Failed to parse token during logout: {}", e.getMessage());
            }
        } else {
            log.info("Token was already blacklisted or null.");
        }
    }
}