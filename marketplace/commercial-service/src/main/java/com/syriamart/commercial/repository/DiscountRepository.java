package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Discount;
import com.syriamart.commercial.model.enums.DiscountScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DiscountRepository extends JpaRepository<Discount, String> {
    @Query("""
           SELECT d FROM Discount d
           WHERE d.active = true
             AND d.validFrom <= :now
             AND d.validTo >= :now
             AND (
               (d.scope = 'PRODUCT'   AND d.targetProductId  = :productId)
             OR (d.scope = 'CATEGORY' AND d.targetCategoryId = :categoryId)
             OR (d.scope = 'SELLER'   AND d.sellerId         = :sellerId)
             OR  d.scope = 'PLATFORM'
             )
           ORDER BY d.discountValue DESC
           """)
    List<Discount> findActiveForProduct(
            @Param("productId")  String productId,
            @Param("categoryId") String categoryId,
            @Param("sellerId")   String sellerId,
            @Param("now")        LocalDateTime now);
}
