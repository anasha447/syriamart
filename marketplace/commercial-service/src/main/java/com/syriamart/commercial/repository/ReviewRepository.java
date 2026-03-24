package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findByProductIdAndApprovedTrue(String productId, Pageable pageable);
    Page<Review> findByCustomerId(String customerId, Pageable pageable);
    Optional<Review> findByOrderItemId(String orderItemId);
    boolean existsByOrderItemId(String orderItemId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.approved = true")
    BigDecimal computeAverageRating(@Param("productId") String productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.approved = true")
    long countApproved(@Param("productId") String productId);
}
