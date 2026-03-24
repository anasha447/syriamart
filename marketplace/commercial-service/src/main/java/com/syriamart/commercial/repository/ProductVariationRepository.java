package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.ProductVariation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVariationRepository extends JpaRepository<ProductVariation, String> {
    List<ProductVariation> findByProductIdOrderByDisplayOrderAsc(String productId);
    void deleteByProductId(String productId);
}
