package com.syriamart.userservice.security;

import com.syriamart.common.model.enums.UserRole;
import com.syriamart.userservice.model.Admin;
import com.syriamart.userservice.model.Seller;
import com.syriamart.userservice.model.User;
import com.syriamart.userservice.repository.AdminRepository;
import com.syriamart.userservice.repository.SellerRepository;
import com.syriamart.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Check Admin
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    admin.getEmail(),
                    admin.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + UserRole.ADMIN.name()))
            );
        }

        // 2. Check Seller
        Optional<Seller> sellerOpt = sellerRepository.findByEmail(email);
        if (sellerOpt.isPresent()) {
            Seller seller = sellerOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    seller.getEmail(),
                    seller.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + UserRole.SELLER.name()))
            );
        }

        // 3. Check User
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
