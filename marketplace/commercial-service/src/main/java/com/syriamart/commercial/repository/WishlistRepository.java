package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, String> {
    List<Wishlist> findByCustomerId(String customerId);
    Optional<Wishlist> findByCustomerIdAndDefaultListTrue(String customerId);
    Optional<Wishlist> findByIdAndCustomerId(String id, String customerId);
}
