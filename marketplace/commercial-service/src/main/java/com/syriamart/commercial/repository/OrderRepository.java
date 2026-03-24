package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Order;
import com.syriamart.common.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String> {
    Page<Order> findByCustomerId(String customerId, Pageable pageable);
    Page<Order> findByCustomerIdAndStatus(String customerId, OrderStatus status, Pageable pageable);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    Optional<Order> findByIdAndCustomerId(String id, String customerId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status AND o.createdAt >= :since")
    long countByStatusSince(@Param("status") OrderStatus status, @Param("since") LocalDateTime since);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.status = 'COMPLETED' AND o.createdAt BETWEEN :from AND :to")
    java.math.BigDecimal sumRevenueCompleted(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
