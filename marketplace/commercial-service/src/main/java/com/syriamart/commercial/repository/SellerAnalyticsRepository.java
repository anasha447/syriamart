package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.SellerAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerAnalyticsRepository extends JpaRepository<SellerAnalytics, String> {
    Optional<SellerAnalytics> findBySellerId(String sellerId);
}