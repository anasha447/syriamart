package com.syriamart.userservice.repository;

import com.syriamart.userservice.model.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, Long> {

    boolean existsByToken(String token);

    // Custom method to delete tokens older than a certain date
    void deleteByExpiryDateBefore(LocalDateTime date);
}