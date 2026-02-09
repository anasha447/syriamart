package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findByUserIdAndIsActive(String userId, Boolean isActive);
}