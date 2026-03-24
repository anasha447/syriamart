package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findByCustomerId(String customerId);
    boolean existsByCustomerId(String customerId);
}
