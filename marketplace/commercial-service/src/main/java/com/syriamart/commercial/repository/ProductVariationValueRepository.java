package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.ProductVariationValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariationValueRepository extends JpaRepository<ProductVariationValue, String> {
    List<ProductVariationValue> findByProductId(String productId);
}