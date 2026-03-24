package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.AdminAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminAnalyticsRepository extends JpaRepository<AdminAnalytics, String> {
    Optional<AdminAnalytics> findByYearAndMonth(int year, int month);
    List<AdminAnalytics> findTop12ByOrderByYearDescMonthDesc();
}
