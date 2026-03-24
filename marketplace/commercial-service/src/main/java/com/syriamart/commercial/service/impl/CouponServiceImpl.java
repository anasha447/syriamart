package com.syriamart.commercial.service.impl;

import com.syriamart.commercial.dto.request.coupon.*;
import com.syriamart.commercial.dto.response.coupon.*;
import com.syriamart.commercial.mapper.CouponMapper;
import com.syriamart.commercial.mapper.DiscountMapper;
import com.syriamart.commercial.model.Coupon;
import com.syriamart.commercial.model.Discount;
import com.syriamart.commercial.repository.*;
import com.syriamart.commercial.service.CouponService;
import com.syriamart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponServiceImpl implements CouponService {

    private final CouponRepository   couponRepo;
    private final DiscountRepository discountRepo;
    private final ProductRepository  productRepo;
    private final CouponMapper       couponMapper;
    private final DiscountMapper     discountMapper;

    // ─────────────────────────────────────────────────────────────────────────
    // COUPON CRUD
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public CouponResponse createCoupon(String sellerId, CouponCreateRequest req) {
        assertCodeUnique(req.code());
        Coupon coupon = buildCoupon(req, sellerId);
        return couponMapper.toResponse(couponRepo.save(coupon));
    }

    @Override
    public CouponResponse createPlatformCoupon(CouponCreateRequest req) {
        assertCodeUnique(req.code());
        Coupon coupon = buildCoupon(req, null);
        return couponMapper.toResponse(couponRepo.save(coupon));
    }

    @Override
    public CouponResponse updateCoupon(String couponId, CouponUpdateRequest req) {
        Coupon coupon = getCoupon(couponId);
        if (req.description()       != null) coupon.setDescription(req.description());
        if (req.minOrderAmount()    != null) coupon.setMinOrderAmount(req.minOrderAmount());
        if (req.maxDiscountAmount() != null) coupon.setMaxDiscountAmount(req.maxDiscountAmount());
        if (req.validFrom()         != null) coupon.setValidFrom(req.validFrom());
        if (req.validTo()           != null) coupon.setValidTo(req.validTo());
        if (req.usageLimit()        != null) coupon.setUsageLimit(req.usageLimit());
        if (req.active()            != null) coupon.setActive(req.active());
        return couponMapper.toResponse(couponRepo.save(coupon));
    }

    @Override
    public void deleteCoupon(String couponId) {
        couponRepo.delete(getCoupon(couponId));
    }

    @Override
    @Transactional(readOnly = true)
    public CouponResponse findByCode(String code) {
        return couponMapper.toResponse(couponRepo.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", code)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> findForSeller(String sellerId, Pageable pageable) {
        return couponMapper.toResponseList(
                couponRepo.findBySellerId(sellerId, pageable).getContent());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> findPlatformCoupons(Pageable pageable) {
        return couponMapper.toResponseList(
                couponRepo.findBySellerIdIsNull(pageable).getContent());
    }

    /**
     * Validates a coupon and returns the computed discount amount.
     * Throws if invalid. Does NOT increment usage (that happens at checkout).
     */
    @Override
    @Transactional(readOnly = true)
    public BigDecimal validateAndComputeDiscount(String code, BigDecimal subtotal, String customerId) {
        Coupon coupon = couponRepo.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", code));
        if (!coupon.isValid()) throw new IllegalStateException("Coupon is expired or inactive.");
        return coupon.computeDiscount(subtotal);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DISCOUNT CRUD
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public DiscountResponse createDiscount(String sellerId, DiscountCreateRequest req) {
        Discount discount = buildDiscount(req, sellerId);
        return discountMapper.toResponse(discountRepo.save(discount));
    }

    @Override
    public DiscountResponse createPlatformDiscount(DiscountCreateRequest req) {
        Discount discount = buildDiscount(req, null);
        return discountMapper.toResponse(discountRepo.save(discount));
    }

    @Override
    public DiscountResponse updateDiscount(String discountId, DiscountUpdateRequest req) {
        Discount discount = discountRepo.findById(discountId)
                .orElseThrow(() -> new ResourceNotFoundException("Discount", discountId));
        if (req.name()          != null) discount.setName(req.name());
        if (req.discountValue() != null) discount.setDiscountValue(req.discountValue());
        if (req.validFrom()     != null) discount.setValidFrom(req.validFrom());
        if (req.validTo()       != null) discount.setValidTo(req.validTo());
        if (req.active()        != null) discount.setActive(req.active());
        return discountMapper.toResponse(discountRepo.save(discount));
    }

    @Override
    public void deleteDiscount(String discountId) {
        discountRepo.deleteById(discountId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DiscountResponse> findActiveForProduct(String productId) {
        var product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        return discountRepo.findActiveForProduct(
                        productId,
                        product.getCategory().getId(),
                        product.getSellerId(),
                        LocalDateTime.now())
                .stream().map(discountMapper::toResponse).toList();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private void assertCodeUnique(String code) {
        if (couponRepo.existsByCodeIgnoreCase(code)) {
            throw new IllegalArgumentException("Coupon code already exists: " + code);
        }
    }

    private Coupon getCoupon(String id) {
        return couponRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));
    }

    private Coupon buildCoupon(CouponCreateRequest req, String sellerId) {
        return Coupon.builder()
                .code(req.code().toUpperCase())
                .description(req.description())
                .discountType(req.discountType())
                .discountValue(req.discountValue())
                .minOrderAmount(req.minOrderAmount() != null ? req.minOrderAmount() : BigDecimal.ZERO)
                .maxDiscountAmount(req.maxDiscountAmount())
                .validFrom(req.validFrom())
                .validTo(req.validTo())
                .usageLimit(req.usageLimit())
                .perUserLimit(req.perUserLimit())
                .sellerId(sellerId)
                .active(true)
                .build();
    }

    private Discount buildDiscount(DiscountCreateRequest req, String sellerId) {
        return Discount.builder()
                .name(req.name())
                .discountType(req.discountType())
                .discountValue(req.discountValue())
                .scope(req.scope())
                .targetProductId(req.targetProductId())
                .targetCategoryId(req.targetCategoryId())
                .sellerId(sellerId)
                .validFrom(req.validFrom())
                .validTo(req.validTo())
                .active(true)
                .build();
    }
}
