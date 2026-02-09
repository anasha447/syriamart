package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, String> {
    Optional<Wishlist> findByUserId(String userId);
}