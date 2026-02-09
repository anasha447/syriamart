package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :id AND r.approved = true")
    Double findAverageRating(@Param("id") String id);
}