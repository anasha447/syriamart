package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, String> {
    Optional<CartItem> findByCartIdAndProductIdAndVariationValueId(String cartId, String productId, String variationValueId);
    void deleteByCartId(String cartId);
    void deleteByCartIdAndProductId(String cartId, String productId);
}
