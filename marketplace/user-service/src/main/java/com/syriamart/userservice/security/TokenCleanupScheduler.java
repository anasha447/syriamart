package com.syriamart.userservice.security;

import com.syriamart.userservice.repository.TokenBlacklistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenCleanupScheduler {

    private final TokenBlacklistRepository tokenBlacklistRepository;

    /**
     * Runs automatically every hour (cron = "0 0 * * * *")
     * Deletes any token from the database that expired more than 48 hours ago.
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void deleteTokensAfter48Hours() {
        log.info("Starting background cleanup: Deleting blacklisted tokens older than 48 hours...");

        // Calculate the time 48 hours ago
        LocalDateTime fortyEightHoursAgo = LocalDateTime.now().minusHours(48);

        // Delete them from the database
        tokenBlacklistRepository.deleteByExpiryDateBefore(fortyEightHoursAgo);

        log.info("Background cleanup complete.");
    }
}