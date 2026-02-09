package com.syriamart.commercial.service.AuthService;

import com.syriamart.commercial.model.User;
import com.syriamart.commercial.repository.UserRepository;
import com.syriamart.common.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class Auth {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public String login(String email, String password) {
        // 1. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // 2. Check password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // 4. Generate token using common-lib logic
        return jwtUtils.generateToken(user.getEmail(), user.getRole().name(), user.getId());
    }
}