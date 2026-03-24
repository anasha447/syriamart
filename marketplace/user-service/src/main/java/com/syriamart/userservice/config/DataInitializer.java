package com.syriamart.userservice.config;

import com.syriamart.common.model.enums.UserRole;
import com.syriamart.userservice.model.Admin;
import com.syriamart.userservice.model.Seller;
import com.syriamart.userservice.model.User;
import com.syriamart.userservice.model.enums.SellerStatus;
import com.syriamart.userservice.repository.AdminRepository;
import com.syriamart.userservice.repository.SellerRepository;
import com.syriamart.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking and initializing test data...");

        String defaultPassword = "password123";

        // 1. Initialize Customer
        if (userRepository.findByEmail("customer@test.com").isEmpty()) {
            User customer = User.builder()
                    .email("customer@test.com")
                    .passwordHash(passwordEncoder.encode(defaultPassword))
                    .fullName("Test Customer")
                    .phone("+1234567890")
                    .role(UserRole.CUSTOMER)
                    .isActive(true)
                    .build();
            userRepository.save(customer);
            log.info("Test Customer initialized.");
        }

        // 2. Initialize Seller (Already Approved)
        if (sellerRepository.findByEmail("seller@test.com").isEmpty()) {
            Seller seller = Seller.builder()
                    .email("seller@test.com")
                    .passwordHash(passwordEncoder.encode(defaultPassword))
                    .name("Test Seller")
                    .phone("+0987654321")
                    .storeName("SyriaMart Electronics")
                    .storeLocation("Damascus")
                    .productType("Electronics")
                    .status(SellerStatus.APPROVED) // Bypassing approval for testing
                    .adminApproved(true)
                    .build();
            sellerRepository.save(seller);
            log.info("Test Seller initialized.");
        }

        // 3. Initialize Admin
        if (adminRepository.findByEmail("admin@test.com").isEmpty()) {
            Admin admin = Admin.builder()
                    .email("admin@test.com")
                    .passwordHash(passwordEncoder.encode(defaultPassword))
                    .fullName("System Admin")
                    // Add any other required Admin fields here if needed
                    .build();
            adminRepository.save(admin);
            log.info("Test Admin initialized.");
        }

        log.info("Data initialization complete!");
    }
}