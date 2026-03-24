package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, String> {
    Optional<Coupon> findByCodeIgnoreCase(String code);
    boolean existsByCodeIgnoreCase(String code);
    Page<Coupon> findBySellerId(String sellerId, Pageable pageable);
    Page<Coupon> findBySellerIdIsNull(Pageable pageable);

    @Modifying
    @Query("UPDATE Coupon c SET c.usageCount = c.usageCount + 1 WHERE c.code = :code")
    void incrementUsage(@Param("code") String code);
}
