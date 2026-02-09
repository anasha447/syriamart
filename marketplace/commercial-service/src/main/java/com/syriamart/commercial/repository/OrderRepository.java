package com.syriamart.commercial.repository;

import com.syriamart.commercial.model.Order;
import com.syriamart.commercial.model.enums.OrderStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserId(String userId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByAssignedDriverId(String assignedDriverId);

    Optional<Order> findByQrTrackingToken(String qrTrackingToken);
}