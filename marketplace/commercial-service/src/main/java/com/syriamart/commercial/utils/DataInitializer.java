package com.syriamart.commercial.utils;

import com.syriamart.commercial.model.User;
import com.syriamart.common.model.enums.UserRole;
import com.syriamart.commercial.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("seller@syriamart.com").isEmpty()) {
            User seller = new User();
            seller.setId(UUID.randomUUID().toString());
            seller.setEmail("seller@syriamart.com");
            // Encrypting the password "123456"
            seller.setPasswordHash(passwordEncoder.encode("123456"));
            seller.setFullName("Test Seller");
            seller.setRole(UserRole.SELLER);
            seller.setIsActive(true);

            userRepository.save(seller);
            System.out.println("✅ Test Seller Created: email: seller@syriamart.com, password: 123456");
        }
    }
}