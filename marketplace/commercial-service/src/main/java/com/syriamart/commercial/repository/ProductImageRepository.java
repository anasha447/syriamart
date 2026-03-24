package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, String> {
    List<ProductImage> findByProductIdOrderByIsPrimaryDescDisplayOrderAsc(String productId);
    Optional<ProductImage> findByProductIdAndIsPrimaryTrue(String productId);
    void deleteByProductId(String productId);
}
