package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.ProductVariationValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductVariationValueRepository extends JpaRepository<ProductVariationValue, String> {
    List<ProductVariationValue> findByProductId(String productId);
    Optional<ProductVariationValue> findBySku(String sku);
    boolean existsBySku(String sku);

    @Modifying
    @Query("UPDATE ProductVariationValue pvv SET pvv.stockQuantity = pvv.stockQuantity - :qty WHERE pvv.id = :id AND pvv.stockQuantity >= :qty")
    int decrementStock(@Param("id") String id, @Param("qty") int qty);

    @Modifying
    @Query("UPDATE ProductVariationValue pvv SET pvv.stockQuantity = pvv.stockQuantity + :qty WHERE pvv.id = :id")
    int incrementStock(@Param("id") String id, @Param("qty") int qty);
}
