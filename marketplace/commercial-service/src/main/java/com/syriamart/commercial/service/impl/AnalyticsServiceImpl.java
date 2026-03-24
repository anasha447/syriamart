package com.syriamart.commercial.service.impl;

import com.syriamart.commercial.dto.response.dashboard.*;
import com.syriamart.commercial.model.*;
import com.syriamart.commercial.repository.*;
import com.syriamart.commercial.service.AnalyticsService;
import com.syriamart.commercial.model.enums.ProductStatus;
import com.syriamart.common.exception.ResourceNotFoundException;
import com.syriamart.common.model.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AnalyticsServiceImpl implements AnalyticsService {

    private final SellerAnalyticsRepository sellerAnalyticsRepo;
    private final AdminAnalyticsRepository  adminAnalyticsRepo;
    private final OrderRepository           orderRepo;
    private final OrderItemRepository       orderItemRepo;
    private final ProductRepository         productRepo;

    // ─────────────────────────────────────────────────────────────────────────
    // SELLER DASHBOARD & ANALYTICS
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public SellerDashboardResponse getSellerDashboard(String sellerId) {
        YearMonth now  = YearMonth.now();
        SellerAnalytics analytics = sellerAnalyticsRepo
                .findBySellerIdAndYearAndMonth(sellerId, now.getYear(), now.getMonthValue())
                .orElse(SellerAnalytics.forCurrentMonth(sellerId));

        long activeProducts  = productRepo.countBySellerIdAndStatus(sellerId, ProductStatus.ACTIVE);
        long pendingProducts = productRepo.countBySellerIdAndStatus(sellerId, ProductStatus.PENDING_REVIEW);

        var recentOrders = orderItemRepo.findBySellerId(sellerId, PageRequest.of(0, 5))
                .getContent().stream()
                .map(OrderItem::getOrder)
                .distinct()
                .map(o -> new com.syriamart.commercial.dto.response.order.OrderListResponse(
                        o.getId(), o.getStatus(), o.getTotal(),
                        o.getItems().size(), o.getTrackingNumber(), o.getCreatedAt()))
                .toList();

        var topProducts = productRepo.findBySellerIdAndStatus(
                        sellerId, ProductStatus.ACTIVE, PageRequest.of(0, 5))
                .getContent().stream()
                .map(p -> new com.syriamart.commercial.dto.response.product.ProductSummaryResponse(
                        p.getId(), p.getName(), p.getSlug(),
                        p.getBasePrice(), p.getBasePrice(),
                        p.getImages().stream().filter(ProductImage::isPrimary)
                                .map(ProductImage::getUrl).findFirst().orElse(null),
                        p.getAverageRating(), p.getTotalReviews(),
                        p.getStatus(), p.getCategory().getId(),
                        p.getSellerId(), p.getTotalSold()))
                .toList();

        return new SellerDashboardResponse(
                sellerId,
                activeProducts, pendingProducts,
                analytics.getTotalOrders(), analytics.getTotalRevenue(),
                analytics.getAverageRating(),
                recentOrders, topProducts);
    }

    @Override
    @Transactional(readOnly = true)
    public SellerAnalyticsResponse getSellerMonthlyAnalytics(String sellerId, int year, int month) {
        SellerAnalytics a = sellerAnalyticsRepo
                .findBySellerIdAndYearAndMonth(sellerId, year, month)
                .orElse(SellerAnalytics.forCurrentMonth(sellerId));
        return toSellerAnalyticsResponse(a);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SellerAnalyticsResponse> getSellerHistoricAnalytics(String sellerId) {
        return sellerAnalyticsRepo.findBySellerIdOrderByYearDescMonthDesc(sellerId)
                .stream().map(this::toSellerAnalyticsResponse).toList();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN DASHBOARD & ANALYTICS
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        YearMonth now = YearMonth.now();
        AdminAnalytics snapshot = adminAnalyticsRepo
                .findByYearAndMonth(now.getYear(), now.getMonthValue())
                .orElse(AdminAnalytics.builder().year(now.getYear()).month(now.getMonthValue()).build());

        long pendingModeration = productRepo.countByStatus(ProductStatus.PENDING_REVIEW);

        var topSellers = sellerAnalyticsRepo
                .findByYearAndMonthOrderByTotalRevenueDesc(now.getYear(), now.getMonthValue(), PageRequest.of(0, 5))
                .getContent().stream()
                .map(a -> new SellerListResponse(
                        a.getSellerId(), null,
                        productRepo.countBySellerIdAndStatus(a.getSellerId(), ProductStatus.ACTIVE),
                        a.getTotalOrders(), a.getTotalRevenue(), a.getAverageRating()))
                .toList();

        var topProducts = productRepo.findTopSelling(PageRequest.of(0, 5))
                .stream()
                .map(p -> new com.syriamart.commercial.dto.response.product.ProductSummaryResponse(
                        p.getId(), p.getName(), p.getSlug(),
                        p.getBasePrice(), p.getBasePrice(),
                        p.getImages().stream().filter(ProductImage::isPrimary)
                                .map(ProductImage::getUrl).findFirst().orElse(null),
                        p.getAverageRating(), p.getTotalReviews(),
                        p.getStatus(), p.getCategory().getId(),
                        p.getSellerId(), p.getTotalSold()))
                .toList();

        var revenueChart = adminAnalyticsRepo.findTop12ByOrderByYearDescMonthDesc()
                .stream()
                .map(a -> new RevenueBreakdownResponse.MonthlyRevenue(
                        a.getYear(), a.getMonth(), a.getTotalRevenue()))
                .toList();

        return new AdminDashboardResponse(
                snapshot.getTotalRevenue(), snapshot.getTotalOrders(),
                snapshot.getActiveSellers(), pendingModeration, snapshot.getTotalCustomers(),
                topSellers, topProducts, revenueChart);
    }

    @Override
    @Transactional(readOnly = true)
    public PlatformAnalyticsResponse getPlatformMonthlyAnalytics(int year, int month) {
        AdminAnalytics a = adminAnalyticsRepo.findByYearAndMonth(year, month)
                .orElseThrow(() -> new ResourceNotFoundException("AdminAnalytics", year + "-" + month));
        return new PlatformAnalyticsResponse(
                a.getYear(), a.getMonth(),
                a.getTotalOrders(), a.getTotalRevenue(),
                a.getTotalCustomers(), a.getActiveSellers(),
                a.getNewProductsListed(), a.getProductsPendingReview(),
                a.getPlatformCommission(), a.getCancelledOrders(), a.getReturnedOrders());
    }

    @Override
    @Transactional(readOnly = true)
    public RevenueBreakdownResponse getRevenueBreakdown(int months) {
        List<RevenueBreakdownResponse.MonthlyRevenue> monthly =
                adminAnalyticsRepo.findTop12ByOrderByYearDescMonthDesc()
                        .stream().limit(months)
                        .map(a -> new RevenueBreakdownResponse.MonthlyRevenue(
                                a.getYear(), a.getMonth(), a.getTotalRevenue()))
                        .toList();
        BigDecimal total      = monthly.stream().map(RevenueBreakdownResponse.MonthlyRevenue::revenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal commission = total.multiply(BigDecimal.valueOf(0.05)); // 5% platform fee
        return new RevenueBreakdownResponse(total, commission, monthly);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SellerListResponse> getTopSellers(int limit) {
        YearMonth now = YearMonth.now();
        return sellerAnalyticsRepo
                .findByYearAndMonthOrderByTotalRevenueDesc(now.getYear(), now.getMonthValue(),
                        PageRequest.of(0, limit))
                .getContent().stream()
                .map(a -> new SellerListResponse(
                        a.getSellerId(), null,
                        productRepo.countBySellerIdAndStatus(a.getSellerId(), ProductStatus.ACTIVE),
                        a.getTotalOrders(), a.getTotalRevenue(), a.getAverageRating()))
                .toList();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CALLED AFTER ORDER STATE TRANSITIONS
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public void onOrderCompleted(String orderId) {
        updateAnalyticsForOrder(orderId, true, false, false);
    }

    @Override
    public void onOrderCancelled(String orderId) {
        updateAnalyticsForOrder(orderId, false, true, false);
    }

    @Override
    public void onOrderReturned(String orderId) {
        updateAnalyticsForOrder(orderId, false, false, true);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private void updateAnalyticsForOrder(String orderId,
                                          boolean completed, boolean cancelled, boolean returned) {
        var order = orderRepo.findById(orderId).orElse(null);
        if (order == null) return;

        YearMonth ym = YearMonth.from(order.getCreatedAt().toLocalDate());

        // ── Per-seller analytics ──────────────────────────────────────────────
        order.getItems().stream()
                .collect(java.util.stream.Collectors.groupingBy(OrderItem::getSellerId))
                .forEach((sellerId, items) -> {
                    SellerAnalytics sa = sellerAnalyticsRepo
                            .findBySellerIdAndYearAndMonth(sellerId, ym.getYear(), ym.getMonthValue())
                            .orElseGet(() -> sellerAnalyticsRepo.save(
                                    SellerAnalytics.forCurrentMonth(sellerId)));

                    sa.setTotalOrders(sa.getTotalOrders() + 1);
                    BigDecimal sellerRevenue = items.stream()
                            .map(OrderItem::getLineTotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    if (completed)  { sa.setCompletedOrders(sa.getCompletedOrders() + 1);
                                      sa.setTotalRevenue(sa.getTotalRevenue().add(sellerRevenue)); }
                    if (cancelled)    sa.setCancelledOrders(sa.getCancelledOrders() + 1);
                    if (returned)     sa.setReturnedOrders(sa.getReturnedOrders() + 1);

                    int totalItems = items.stream().mapToInt(OrderItem::getQuantity).sum();
                    sa.setTotalItemsSold(sa.getTotalItemsSold() + totalItems);

                    if (sa.getTotalOrders() > 0) {
                        sa.setAverageOrderValue(
                                sa.getTotalRevenue().divide(
                                        BigDecimal.valueOf(sa.getTotalOrders()), 2, RoundingMode.HALF_UP));
                    }

                    sellerAnalyticsRepo.save(sa);
                });

        // ── Platform-wide analytics ───────────────────────────────────────────
        AdminAnalytics aa = adminAnalyticsRepo
                .findByYearAndMonth(ym.getYear(), ym.getMonthValue())
                .orElseGet(() -> adminAnalyticsRepo.save(
                        AdminAnalytics.builder()
                                .year(ym.getYear()).month(ym.getMonthValue()).build()));

        aa.setTotalOrders(aa.getTotalOrders() + 1);
        if (completed) {
            aa.setTotalRevenue(aa.getTotalRevenue().add(order.getTotal()));
            aa.setPlatformCommission(aa.getPlatformCommission()
                    .add(order.getTotal().multiply(BigDecimal.valueOf(0.05))));
        }
        if (cancelled) aa.setCancelledOrders(aa.getCancelledOrders() + 1);
        if (returned)  aa.setReturnedOrders(aa.getReturnedOrders() + 1);
        adminAnalyticsRepo.save(aa);
    }

    private SellerAnalyticsResponse toSellerAnalyticsResponse(SellerAnalytics a) {
        return new SellerAnalyticsResponse(
                a.getSellerId(), a.getYear(), a.getMonth(),
                a.getTotalOrders(), a.getCompletedOrders(),
                a.getCancelledOrders(), a.getReturnedOrders(),
                a.getTotalRevenue(), a.getTotalItemsSold(),
                a.getAverageOrderValue(), a.getAverageRating(),
                a.getTotalReviews(), a.getReturnRate());
    }
}
