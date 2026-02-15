package com.syriamart.userservice.controller;

import com.syriamart.common.model.enums.UserRole;
import com.syriamart.common.security.JwtUtils;
import com.syriamart.userservice.dto.request.seller.SellerRegistrationRequest;
import com.syriamart.userservice.dto.request.user.UserLoginRequest;
import com.syriamart.userservice.dto.request.user.UserRegistrationRequest;
import com.syriamart.userservice.dto.response.auth.AuthenticationResponse;
import com.syriamart.userservice.model.Admin;
import com.syriamart.userservice.model.Seller;
import com.syriamart.userservice.model.User;
import com.syriamart.userservice.model.enums.SellerStatus;
import com.syriamart.userservice.repository.AdminRepository;
import com.syriamart.userservice.repository.SellerRepository;
import com.syriamart.userservice.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final AdminRepository adminRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody UserLoginRequest request) {
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

        return ResponseEntity.ok(new AuthenticationResponse(token, email, role, userId));
    }

    @PostMapping("/register/customer")
    public ResponseEntity<String> registerCustomer(@Valid @RequestBody UserRegistrationRequest request) {
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
        return ResponseEntity.status(HttpStatus.CREATED).body("Customer registered successfully");
    }

    @PostMapping("/register/seller")
    public ResponseEntity<String> registerSeller(@Valid @RequestBody SellerRegistrationRequest request) {
        log.info("Registering seller: {}", request.email());
        checkEmailUniqueness(request.email());

        Seller seller = Seller.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .name(request.fullName()) // Mapping fullName to name
                .phone(request.phone())
                .storeName(request.storeName())
                .storeLocation(request.storeLocation())
                .productType(request.productType())
                .status(SellerStatus.PENDING_APPROVAL)
                .adminApproved(false)
                .build();

        sellerRepository.save(seller);
        return ResponseEntity.status(HttpStatus.CREATED).body("Seller registered successfully. Pending approval.");
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
             // Expecting CUSTOMER or DRIVER, which are in User table (UserRole enum)
            return userRepository.findByEmail(email).map(User::getId).orElseThrow();
        }
    }
}
