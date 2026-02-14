package com.syriamart.commercial.service.AuthService;

import com.syriamart.commercial.dto.response.admin.AuthenticationResponse;
import com.syriamart.commercial.mapper.AuthMapper;
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
    private final AuthMapper authMapper; // <--- Inject the Mapper here

    public AuthenticationResponse login(String email, String password) {
        // 1. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // 2. Check password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Update last login audit
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // 4. Generate the JWT Token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        // 5. Use Mapper to return the DTO (Clean & Simple)
        return authMapper.toResponse(user, token);
    }
}