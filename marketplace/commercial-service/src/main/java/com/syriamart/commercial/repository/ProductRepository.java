package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Product;
import com.syriamart.commercial.model.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findBySlug(String slug);

    Page<Product> findByStatusAndCategoryId(ProductStatus status, String categoryId, Pageable pageable);
    Page<Product> findByStatusAndSubCategoryId(ProductStatus status, String subCategoryId, Pageable pageable);
    Page<Product> findBySellerIdAndStatus(String sellerId, ProductStatus status, Pageable pageable);
    Page<Product> findBySellerId(String sellerId, Pageable pageable);
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    long countBySellerIdAndStatus(String sellerId, ProductStatus status);
    long countByStatus(ProductStatus status);

    @Query("""
           SELECT p FROM Product p
           WHERE p.status = 'ACTIVE'
             AND (LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%',:q,'%'))
               OR LOWER(p.tags) LIKE LOWER(CONCAT('%',:q,'%')))
           """)
    Page<Product> searchActive(@Param("q") String query, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' ORDER BY p.totalSold DESC")
    List<Product> findTopSelling(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' ORDER BY p.averageRating DESC, p.totalReviews DESC")
    List<Product> findTopRated(Pageable pageable);
}
