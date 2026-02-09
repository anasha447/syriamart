package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.ProductVariation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariationRepository extends JpaRepository<ProductVariation, String> {
    List<ProductVariation> findByProductId(String productId);
}