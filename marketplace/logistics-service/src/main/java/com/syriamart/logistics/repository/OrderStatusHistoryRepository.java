package com.syriamart.logistics.repository;

import com.syriamart.common.model.enums.OrderStatus;
import com.syriamart.logistics.model.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, String> {

    /** Full timeline for a single order, sorted oldest-first. */
    List<OrderStatusHistory> findByOrderIdOrderByChangedAtAsc(String orderId);

    /** Most recent status record for quick current-status lookup. */
    Optional<OrderStatusHistory> findTopByOrderIdOrderByChangedAtDesc(String orderId);

    boolean existsByOrderIdAndNewStatus(String orderId, OrderStatus status);
}
