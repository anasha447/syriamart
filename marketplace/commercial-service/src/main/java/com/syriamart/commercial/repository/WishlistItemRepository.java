package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, String> {
    Optional<WishlistItem> findByWishlistIdAndProductId(String wishlistId, String productId);
    boolean existsByWishlistIdAndProductId(String wishlistId, String productId);
    void deleteByWishlistIdAndProductId(String wishlistId, String productId);
}
