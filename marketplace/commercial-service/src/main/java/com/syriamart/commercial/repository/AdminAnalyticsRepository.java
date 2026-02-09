package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.AdminAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminAnalyticsRepository extends JpaRepository<AdminAnalytics, String> {
    Optional<AdminAnalytics> findByAdminId(String adminId);
}