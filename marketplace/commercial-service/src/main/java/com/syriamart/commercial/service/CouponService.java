package com.syriamart.commercial.service;

import com.syriamart.commercial.dto.request.coupon.*;
import com.syriamart.commercial.dto.response.coupon.*;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface CouponService {
    CouponResponse createCoupon(String sellerId, CouponCreateRequest request);
    CouponResponse createPlatformCoupon(CouponCreateRequest request);
    CouponResponse updateCoupon(String couponId, CouponUpdateRequest request);
    void deleteCoupon(String couponId);
    CouponResponse findByCode(String code);
    List<CouponResponse> findForSeller(String sellerId, Pageable pageable);
    List<CouponResponse> findPlatformCoupons(Pageable pageable);

    BigDecimal validateAndComputeDiscount(String code, BigDecimal subtotal, String customerId);

    DiscountResponse createDiscount(String sellerId, DiscountCreateRequest request);
    DiscountResponse createPlatformDiscount(DiscountCreateRequest request);
    DiscountResponse updateDiscount(String discountId, DiscountUpdateRequest request);
    void deleteDiscount(String discountId);
    List<DiscountResponse> findActiveForProduct(String productId);
}
