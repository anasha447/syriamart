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
        // 1. Create Test Seller
        if (userRepository.findByEmail("seller@syriamart.com").isEmpty()) {
            User seller = new User();
            seller.setId(UUID.randomUUID().toString());
            seller.setEmail("seller@syriamart.com");
            seller.setPasswordHash(passwordEncoder.encode("123456"));
            seller.setFullName("Test Seller");
            seller.setRole(UserRole.SELLER);
            seller.setIsActive(true);

            userRepository.save(seller);
            System.out.println("✅ Test Seller Created: email: seller@syriamart.com, password: 123456");
        }

        // 2. Create Test Admin (Added this block)
        if (userRepository.findByEmail("admin@syriamart.com").isEmpty()) {
            User admin = new User();
            admin.setId(UUID.randomUUID().toString());
            admin.setEmail("admin@syriamart.com");
            // Encrypting the password "123456"
            admin.setPasswordHash(passwordEncoder.encode("123456"));
            admin.setFullName("System Admin");
            admin.setRole(UserRole.ADMIN); // Make sure UserRole.ADMIN exists in your Enum
            admin.setIsActive(true);

            userRepository.save(admin);
            System.out.println("✅ Test Admin Created: email: admin@syriamart.com, password: 123456");
        }
    }
}