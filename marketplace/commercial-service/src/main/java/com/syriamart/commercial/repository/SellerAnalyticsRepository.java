package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.SellerAnalytics;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SellerAnalyticsRepository extends JpaRepository<SellerAnalytics, String> {
    Optional<SellerAnalytics> findBySellerIdAndYearAndMonth(String sellerId, int year, int month);
    List<SellerAnalytics> findBySellerIdOrderByYearDescMonthDesc(String sellerId);
    Page<SellerAnalytics> findByYearAndMonthOrderByTotalRevenueDesc(int year, int month, Pageable pageable);
}
