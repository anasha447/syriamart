package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.response.dashboard.*;

import java.util.List;

public interface AnalyticsService {
    SellerDashboardResponse getSellerDashboard(String sellerId);
    SellerAnalyticsResponse getSellerMonthlyAnalytics(String sellerId, int year, int month);
    List<SellerAnalyticsResponse> getSellerHistoricAnalytics(String sellerId);

    AdminDashboardResponse getAdminDashboard();
    PlatformAnalyticsResponse getPlatformMonthlyAnalytics(int year, int month);
    RevenueBreakdownResponse getRevenueBreakdown(int months);
    List<SellerListResponse> getTopSellers(int limit);

    // Called internally after order state transitions
    void onOrderCompleted(String orderId);
    void onOrderCancelled(String orderId);
    void onOrderReturned(String orderId);
}
