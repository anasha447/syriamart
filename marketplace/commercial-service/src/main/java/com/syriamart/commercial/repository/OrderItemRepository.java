package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.OrderItem;
import com.syriamart.commercial.model.enums.OrderItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
    List<OrderItem> findByOrderId(String orderId);
    Page<OrderItem> findBySellerIdAndStatus(String sellerId, OrderItemStatus status, Pageable pageable);
    Page<OrderItem> findBySellerId(String sellerId, Pageable pageable);

    Optional<OrderItem> findByIdAndSellerId(String id, String sellerId);
    boolean existsByOrderIdAndProductIdAndStatus(String orderId, String productId, OrderItemStatus status);

    /** Checks whether the customer has a delivered item for the given product (purchase verification). */
    @Query("""
           SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END
           FROM OrderItem oi JOIN oi.order o
           WHERE o.customerId = :customerId
             AND oi.productId = :productId
             AND oi.status = 'DELIVERED'
           """)
    boolean hasCustomerDeliveredItem(@Param("customerId") String customerId, @Param("productId") String productId);

    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.sellerId = :sellerId AND oi.status = 'DELIVERED'")
    Long sumDeliveredItemsBySeller(@Param("sellerId") String sellerId);
}
